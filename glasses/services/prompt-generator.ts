import axios from 'axios';
import { HatPrompts } from '../types';
import { SIX_HATS } from '../constants/config';

/**
 * Generates prompts for the Six Thinking Hats walk
 * @param problem The problem to generate prompts for
 * @returns Object with hat prompts
 */
export async function generateSixHatPrompts(problem: string): Promise<HatPrompts> {
  const hatPrompts: HatPrompts = {};
  
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.warn('OpenAI API key not found. Returning empty prompts.');
      return {};
    }
    
    // Generate prompts for each hat
    for (const hat of SIX_HATS) {
      console.log(`Generating prompts for ${hat.name}...`);
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are helping create thought prompts for Edward de Bono's Six Thinking Hats method. 
              Generate 4 short thought prompts (15 words or less each) for the ${hat.name} (${hat.description}) 
              perspective. The prompts should help someone think about a problem while walking.
              Return just the prompts, one per line, without numbering or bullet points.`
            },
            {
              role: 'user',
              content: `Generate ${hat.name} prompts for this problem: "${problem}"`
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Parse the response to get the prompts
      const aiResponse = response.data.choices[0].message.content;
      const prompts = aiResponse.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '')) // Remove numbering if present
        .map(line => line.replace(/^-\s*/, '')); // Remove bullet points if present
      
      hatPrompts[hat.name] = prompts;
      
      // Log the generated prompts
      console.log(`${hat.name} prompts:`, prompts);
      
      // Add a short delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return hatPrompts;
  } catch (error) {
    console.error('Error generating prompts with AI:', error);
    return {};
  }
}

/**
 * Generates prompts for the Inspiration walk
 * @param problem The problem to generate prompts for
 * @param people Array of inspirational people
 * @returns Object with person prompts
 */
export async function generateInspirationPrompts(
  problem: string, 
  people: string[]
): Promise<{ [person: string]: string[] }> {
  const personPrompts: { [person: string]: string[] } = {};
  
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    
    if (!openaiApiKey) {
      console.warn('OpenAI API key not found. Returning empty prompts.');
      return {};
    }
    
    // Generate prompts for each person
    for (const person of people) {
      console.log(`Generating prompts for ${person}...`);
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are helping create thought prompts from the perspective of inspirational figures.
              Generate 4 short thought prompts (15 words or less each) that ${person} might say or think about
              the given problem. The prompts should help someone think about a problem while walking.
              Return just the prompts, one per line, without numbering or bullet points.`
            },
            {
              role: 'user',
              content: `Generate inspirational prompts from ${person}'s perspective on this problem: "${problem}"`
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Parse the response to get the prompts
      const aiResponse = response.data.choices[0].message.content;
      const prompts = aiResponse.split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '')) // Remove numbering if present
        .map(line => line.replace(/^-\s*/, '')); // Remove bullet points if present
      
      personPrompts[person] = prompts;
      
      // Log the generated prompts
      console.log(`${person} prompts:`, prompts);
      
      // Add a short delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return personPrompts;
  } catch (error) {
    console.error('Error generating prompts with AI:', error);
    return {};
  }
}