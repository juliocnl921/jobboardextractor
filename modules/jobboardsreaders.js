import { linkedinReader} from './readers/linkedin.js';
import { indeedReader} from './readers/indeed.js';
import { worktableReader} from './readers/workable.js';

export const jobBoardsReaders = [linkedinReader, indeedReader, worktableReader]