import axios from 'axios';
import { promises } from 'dns';
import * as vscode from 'vscode';
export async function getFilesInRepository(filetosearch: string): Promise<string> {
	const owner = 'hashicorp';
	const repo = 'vscode-terraform';
	const branch = 'main';
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;
    try {
		const response = await axios.get(apiUrl);
        const contents = response.data;
        const files = contents.map(item => item.name);
		if(files.includes(filetosearch))
			{
				const apitoretrive = `https://api.github.com/repos/${owner}/${repo}/contents/${filetosearch}`;
				const response = await axios.get(apitoretrive);
        		const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
        		return content;
			}else{return 'false';}
    } catch (error) {
        console.error('Error fetching repository contents:', error.response?.data || error.message);
        return ;
    }
}
