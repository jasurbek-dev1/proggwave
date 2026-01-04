import { ArenaProblem, ArenaSubmission, ArenaMatch, Player } from '@/types';
import { mockPlayers, currentUser } from '@/data/mockData';

const mockProblems: ArenaProblem[] = [
  {
    id: 'prob1',
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    starterCode: `function twoSum(nums: number[], target: number): number[] {
  // Your code here
}`,
    testCases: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' },
    ],
    timeLimit: 1000,
    memoryLimit: 128,
  },
  {
    id: 'prob2',
    title: 'Reverse String',
    difficulty: 'easy',
    description: 'Write a function that reverses a string. The input string is given as an array of characters.',
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
    ],
    constraints: ['1 <= s.length <= 10^5', 's[i] is a printable ascii character.'],
    starterCode: `function reverseString(s: string[]): void {
  // Your code here
}`,
    testCases: [
      { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
    ],
    timeLimit: 500,
    memoryLimit: 64,
  },
  {
    id: 'prob3',
    title: 'Valid Parentheses',
    difficulty: 'medium',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\''],
    starterCode: `function isValid(s: string): boolean {
  // Your code here
}`,
    testCases: [
      { input: '"()"', expected: 'true' },
      { input: '"()[]{}"', expected: 'true' },
      { input: '"(]"', expected: 'false' },
    ],
    timeLimit: 500,
    memoryLimit: 64,
  },
  {
    id: 'prob4',
    title: 'Binary Search',
    difficulty: 'medium',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All the integers in nums are unique.'],
    starterCode: `function search(nums: number[], target: number): number {
  // Your code here
}`,
    testCases: [
      { input: '[-1,0,3,5,9,12], 9', expected: '4' },
      { input: '[-1,0,3,5,9,12], 2', expected: '-1' },
    ],
    timeLimit: 500,
    memoryLimit: 64,
  },
  {
    id: 'prob5',
    title: 'Longest Common Subsequence',
    difficulty: 'hard',
    description: 'Given two strings text1 and text2, return the length of their longest common subsequence.',
    examples: [
      { input: 'text1 = "abcde", text2 = "ace"', output: '3' },
      { input: 'text1 = "abc", text2 = "abc"', output: '3' },
    ],
    constraints: ['1 <= text1.length, text2.length <= 1000', 'text1 and text2 consist of only lowercase English characters.'],
    starterCode: `function longestCommonSubsequence(text1: string, text2: string): number {
  // Your code here
}`,
    testCases: [
      { input: '"abcde", "ace"', expected: '3' },
      { input: '"abc", "abc"', expected: '3' },
    ],
    timeLimit: 2000,
    memoryLimit: 256,
  },
];

let submissions: ArenaSubmission[] = [];
let activeMatch: ArenaMatch | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const arenaService = {
  async getProblems(): Promise<ArenaProblem[]> {
    await delay(300);
    return mockProblems;
  },

  async getProblem(problemId: string): Promise<ArenaProblem | null> {
    await delay(200);
    return mockProblems.find(p => p.id === problemId) || null;
  },

  async submitSolution(problemId: string, code: string, language: string): Promise<ArenaSubmission> {
    await delay(1000); // Simulate execution time
    
    // Mock random result
    const statuses: ArenaSubmission['status'][] = ['accepted', 'wrong_answer', 'time_limit', 'runtime_error'];
    const randomStatus = Math.random() > 0.5 ? 'accepted' : statuses[Math.floor(Math.random() * statuses.length)];
    
    const submission: ArenaSubmission = {
      id: `sub${Date.now()}`,
      odudlemId: problemId,
      userId: currentUser.id,
      code,
      language,
      status: randomStatus,
      executionTime: Math.floor(Math.random() * 500) + 50,
      memory: Math.floor(Math.random() * 50) + 10,
      submittedAt: new Date().toISOString(),
    };
    
    submissions.push(submission);
    return submission;
  },

  async getSubmissions(problemId?: string): Promise<ArenaSubmission[]> {
    await delay(200);
    if (problemId) {
      return submissions.filter(s => s.odudlemId === problemId);
    }
    return submissions;
  },

  async findMatch(): Promise<ArenaMatch> {
    await delay(2000); // Simulate matchmaking
    
    const randomProblem = mockProblems[Math.floor(Math.random() * mockProblems.length)];
    const opponent = mockPlayers[Math.floor(Math.random() * mockPlayers.length)];
    
    const currentPlayer: Player = {
      id: currentUser.id,
      username: currentUser.username,
      rating: 1500,
      wins: 10,
      losses: 5,
      avatar: currentUser.avatar,
    };
    
    activeMatch = {
      id: `match${Date.now()}`,
      problem: randomProblem,
      players: [currentPlayer, opponent],
      status: 'countdown',
      timeLimit: 900, // 15 minutes
    };
    
    return activeMatch;
  },

  async startMatch(matchId: string): Promise<ArenaMatch | null> {
    await delay(100);
    if (activeMatch && activeMatch.id === matchId) {
      activeMatch.status = 'in_progress';
      activeMatch.startedAt = new Date().toISOString();
    }
    return activeMatch;
  },

  async endMatch(matchId: string, winnerId?: string): Promise<ArenaMatch | null> {
    await delay(100);
    if (activeMatch && activeMatch.id === matchId) {
      activeMatch.status = 'finished';
      activeMatch.endedAt = new Date().toISOString();
      activeMatch.winner = winnerId;
      const finishedMatch = { ...activeMatch };
      activeMatch = null;
      return finishedMatch;
    }
    return null;
  },

  async getActiveMatch(): Promise<ArenaMatch | null> {
    await delay(50);
    return activeMatch;
  },

  async getLeaderboard(): Promise<Player[]> {
    await delay(300);
    return mockPlayers.sort((a, b) => b.rating - a.rating);
  },
};
