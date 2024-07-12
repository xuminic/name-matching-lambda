
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import Levenshtein from 'fast-levenshtein';

/* You need to export your OpenAI API key ahead of running this program, like this:
 * export OPENAI_API_KEY='sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
 * in your runtime environment. */
const apiKey = process.env.OPENAI_API_KEY || '';
const apiUrl = 'https://api.openai.com/v1/chat/completions';


/* for a demo solution, the name database is loaded from a CSV file as a string array.
 * In real life it should be read from a database and converted to the string array
 * as a short list which will be passed to OpenAI aftermath. */
const namesPath = path.join(__dirname, 'names.csv');
let names: string[];

try {
    const data = fs.readFileSync(namesPath, 'utf-8');
    names = parse(data, { delimiter: ',', trim: true, skip_empty_lines: true }).flat();
} catch (error) {
    console.error('Error reading names file:', error);
    names = [];
}


/* generate a string list which should include, in whatever way, the target string */
function getPotentialMatches(inputName: string, threshold: number = 3): string[] {
    return names.filter(name => Levenshtein.get(inputName, name) <= threshold);
}


/* generate a string list which includes the substring of the target string */ 
function getSubstringMatches(inputName: string): string[] {
    const inputNameLower = inputName.toLowerCase();
    const substrings = getSubstrings(inputNameLower);
    return names.filter(name => 
        substrings.some(substring => name.toLowerCase().includes(substring))
    );
}

/* slice the target string to some substrings */
function getSubstrings(input: string): string[] {
    const substrings: string[] = [];
    const length = input.length;
    for (let i = 0; i < length; i++) {
        for (let j = i + 1; j <= length; j++) {
            substrings.push(input.slice(i, j));
        }
    }
    return substrings;
}


/* the main function to do the job: find a most likely name from a piece */
async function findClosestMatch(inputName: string): Promise<string> {
    /* firstly trying to get a short list of the candidate names from the name database.
    * otherwise the name database would be too big to pass to OpenAI. */
    let potentialMatches = getPotentialMatches(inputName);

    /* secondly, to make the program robuster, if there's no  match in the potential matches,
     * the part of the target name would be used to extend the search range. */
    if (potentialMatches.length === 0) {
        potentialMatches = getSubstringMatches(inputName);
    }

    if (potentialMatches.length === 0) {
        return 'No match found';
    }
    //console.log('Potential Matches:', potentialMatches);
    
    /* here is the prompt to OpenAI */
    /*const prompt = `
    Here is a list of potential names:
    ${potentialMatches.join('\n')}

    Find the closest match for the input name: "${inputName}"
    Return the matching name exactly as it appears in the list.
    `;*/

    const prompt = `
    Here is a list of potential names:
    ${potentialMatches.join('\n')}

    Find a female name likely matching for the input name: "${inputName}"
    Return the matching name exactly as it appears in the list.
    `;

    /* send out the prompt and the http head and waiting for the response */
    try {
        const response = await axios.post(
            apiUrl,
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a name matching assistant.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            }
        );

        if (response.data.choices && response.data.choices.length > 0) {
            return response.data.choices[0].message.content.trim();
        } else {
            return 'No match found';
        }
    } catch (error) {
        console.error('Error fetching completion:', error);
        return 'Error fetching completion';
    }
}


/* the AWS lambda interface, try this after deploy:
 *   curl -X GET "https://apiurl.zone.amazonaws.com/prod/items?name=huawen"
 */
export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    const inputName = event.queryStringParameters?.name || '';
    const match = await findClosestMatch(inputName);
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            input: inputName,
            match: match
        }),
    };

    callback(null, response);
};


/* the local test interface, try this:
*     node lambda/namematching.js wen
*/
if (require.main === module) {
    const inputName = process.argv[2];
    if (!inputName) {
        console.error('Please provide a name to match as a command line argument.');
        process.exit(1);
    }

    findClosestMatch(inputName).then(match => {
        console.log('Closest match:', match);
    });
}


