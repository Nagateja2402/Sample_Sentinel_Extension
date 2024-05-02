import axios from 'axios';
import { promises } from 'dns';
import * as vscode from 'vscode';
export async function getFilesInRepository(owner: string, repo: string, branch: string, filetosearch: string): Promise<string> {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;
    try {
		const response = await axios.get(apiUrl);
        const contents = response.data;
        const files = contents.map(item => item.name);
		if(files.includes(filetosearch))
			{
				const apitoretrive = `https://api.github.com/repos/${owner}/${repo}/contents/${filetosearch}?ref=${branch}`;
				const response = await axios.get(apitoretrive);
        		const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        		return content;
			}else{return 'false';}
    } catch (error) {
        console.error('Error fetching repository contents:', error.response?.data || error.message);
        return ;
    }
}
