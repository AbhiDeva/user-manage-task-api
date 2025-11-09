import axios from 'axios';

const PISTON_API = process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston';

const languageMap = {
  javascript: 'javascript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  typescript: 'typescript',
};

export const executeCode = async (language, code, input = '') => {
  try {
    const response = await axios.post(`${PISTON_API}/execute`, {
      language: languageMap[language],
      version: '*',
      files: [
        {
          content: code,
        },
      ],
      stdin: input,
    });

    if (response.data.run) {
      return {
        success: !response.data.run.stderr,
        output: response.data.run.stdout || '',
        error: response.data.run.stderr || '',
      };
    }

    return {
      success: false,
      output: '',
      error: 'Execution failed',
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: error.message,
    };
  }
};