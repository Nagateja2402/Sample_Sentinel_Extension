"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFilesInRepository = void 0;
const axios_1 = require("axios");
async function getFilesInRepository(owner, repo, branch, filetosearch) {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;
    try {
        const response = await axios_1.default.get(apiUrl);
        const contents = response.data;
        const files = contents.map(item => item.name);
        if (files.includes(filetosearch)) {
            const apitoretrive = `https://api.github.com/repos/${owner}/${repo}/contents/${filetosearch}?ref=${branch}`;
            const response = await axios_1.default.get(apitoretrive);
            const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
            return content;
        }
        else {
            return 'false';
        }
    }
    catch (error) {
        console.error('Error fetching repository contents:', error.response?.data || error.message);
        return;
    }
}
exports.getFilesInRepository = getFilesInRepository;
//# sourceMappingURL=getGithubcontent.js.map