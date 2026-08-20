// The ACTUAL mock paper — the real exam screenshots (from Finals/Mock Exam/,
// copied to public/mock/) shown in place of a typed stem, with the same verified
// answers/widgets as the AI-generated mock. Charts, code, tables and diagrams
// are the original images; you still answer with interactive widgets.
import { mockQuestions } from './mock-questions.js';

// content images per question (the code / diagram / table / setup — NOT the
// options, which stay as interactive widgets)
const IMAGES = {
  'mock-q1':  ['/mock/Q01_InsertionSort_CodeCompletion.jpeg'],
  'mock-q2':  ['/mock/Q02a_BubbleVsInsertion_BubblePseudocode.jpeg', '/mock/Q02b_BubbleVsInsertion_InsertionPseudocode_Dropdowns.jpeg'],
  'mock-q3':  ['/mock/Q03a_BuildMaxHeap_TreeDiagram.jpeg', '/mock/Q03b_BuildMaxHeap_Blanks_CallCount.jpeg'],
  'mock-q4':  ['/mock/Q04a_CodeTrace_Recursion_FullCode.jpeg'],
  'mock-q5':  ['/mock/Q05a_AbstractBaseClass_Code.jpeg'],
  'mock-q6':  ['/mock/Q06a_Inheritance_Super_Code.jpeg'],
  'mock-q7':  ['/mock/Q07a_TopologicalSort_Stem.jpeg', '/mock/Q07b_TopologicalSort_Instructions.jpeg', '/mock/Q07c_TopologicalSort_Graph.jpeg'],
  'mock-q8':  ['/mock/Q08_StateSpaceSearch.jpeg'],
  'mock-q9':  ['/mock/Q09a_Pandas_DataFrame.jpeg', '/mock/Q09b_Pandas_MatchingPrompts.jpeg'],
  'mock-q10': ['/mock/Q10a_ConfusionMatrix_Table.jpeg'],
  'mock-q11': ['/mock/Q11a_ComputeCost_Numpy_Code.jpeg'],
  'mock-q12': ['/mock/Q12_DataVisualisation.jpeg'],
  'mock-q13': ['/mock/Q13_LinRegMetrics_INCORRECT.jpeg'],
  'mock-q14': ['/mock/Q14_PolynomialLinReg_CORRECT.jpeg'],
  'mock-q15': ['/mock/Q15a_LogReg_GradDescent_Formulas.jpeg', '/mock/Q15b_LogReg_GradDescent_Data_b0.jpeg'],
  'mock-q16': ['/mock/Q15a_LogReg_GradDescent_Formulas.jpeg', '/mock/Q15b_LogReg_GradDescent_Data_b0.jpeg', '/mock/Q16_LogReg_GradDescent_b1.jpeg'],
  'mock-q17': ['/mock/Q17_LinReg_Predict_Setup.jpeg'],
  'mock-q18': ['/mock/Q17_LinReg_Predict_Setup.jpeg', '/mock/Q18_LinReg_Predict_y3.jpeg'],
  'mock-q19': ['/mock/Q17_LinReg_Predict_Setup.jpeg', '/mock/Q19_LinReg_Predict_y4.jpeg'],
  'mock-q20': ['/mock/Q17_LinReg_Predict_Setup.jpeg', '/mock/Q20_LinReg_MSE.jpeg'],
  'mock-q21': ['/mock/Q17_LinReg_Predict_Setup.jpeg', '/mock/Q21_LinReg_R2.jpeg'],
};

// short instruction shown under the image (the image IS the question)
const STEMS = {
  'mock-q1':  'Fill the blanks so the code prints the output shown above.',
  'mock-q2':  'For each array, which sort makes **fewer swaps**? (Bubble / Insertion / Both the same)',
  'mock-q3':  'Give the array **after** `build_max_heap`, then the number of `max_heapify` calls.',
  'mock-q4':  'Pick BLANK1 / BLANK2 so the assert passes.',
  'mock-q5':  'Which option does **NOT** cause an error?',
  'mock-q6':  'Select **every** correct statement.',
  'mock-q7':  'Order all 11 nodes (topological sort).',
  'mock-q8':  'Select **every** correct statement.',
  'mock-q9':  'Match each statement to its printed output.',
  'mock-q10': 'Select **every** correct statement.',
  'mock-q11': 'Which expression fills the blank so the code runs and returns the correct cost?',
  'mock-q12': 'Select **every** correct statement.',
  'mock-q13': '⚠ Select the **INCORRECT** statements.',
  'mock-q14': 'Select **every** correct statement.',
  'mock-q15': 'Compute **b₀** after one gradient-descent update (2 d.p.).',
  'mock-q16': 'Compute **b₁** after one gradient-descent update (2 d.p.).',
  'mock-q17': 'Compute `ŷ(2)`.',
  'mock-q18': 'Compute `ŷ(3)`.',
  'mock-q19': 'Compute `ŷ(4)`.',
  'mock-q20': 'Compute the **MSE** over the 3 test points.',
  'mock-q21': 'Compute **R²** over the 3 test points (2 d.p.).',
};

// Per-question overrides: some questions are pure code and are better REPLICATED
// as text than shown as a (glary, sometimes-truncated) screenshot. Q1 is a code-
// completion whose real form has 6 dropdowns — including the two `while`-condition
// blanks my typed mock had left fixed — so we rebuild it faithfully here.
const OVERRIDES = {
  'mock-q1': {
    images: [], // replicate as text, no screenshot
    stem: "Study this Insertion Sort. For `array = [3, 5, 1, 2]` the printed output is:\n\n```\narray: [3, 5, 1, 2]\narray: [3, 5, 2, 1]\narray: [3, 5, 2, 1]\narray: [5, 3, 2, 1]\n```\n\nFill all six blanks so the code produces exactly this output.",
    code:
`def insertion_sort(array):
    n = len(array)
    for outer_index in range( ⟨b1⟩ , ⟨b2⟩ , ⟨b3⟩ ):
        inner_index = outer_index
        while ( inner_index < ⟨b4⟩ and array[inner_index] < ⟨b5⟩ ):
            temp = array[inner_index]
            array[inner_index] = array[inner_index + 1]
            array[inner_index + 1] = temp
            inner_index += ⟨b6⟩
        print("array: ", array)`,
    payload: {
      blanks: [
        { id: 'b1', label: 'range start', options: ['0', 'n-1', 'n', '1', 'n-2'] },
        { id: 'b2', label: 'range stop', options: ['0', '-1', 'n', 'n-1'] },
        { id: 'b3', label: 'range step', options: ['1', '-1', '2', '-2'] },
        { id: 'b4', label: 'inner_index <', options: ['n', 'n-1', '0', 'outer_index'] },
        { id: 'b5', label: 'array[inner_index] <', options: ['array[inner_index+1]', 'array[inner_index-1]', 'array[outer_index]', 'array[0]'] },
        { id: 'b6', label: 'inner step', options: ['1', '-1', '2', '0'] },
      ],
    },
    answer: { b1: 'n-1', b2: '-1', b3: '-1', b4: 'n-1', b5: 'array[inner_index+1]', b6: '1' },
    explanation: "4 printed lines → `range(n-1, -1, -1)`. The while pushes larger elements right: `inner_index < n-1 and array[inner_index] < array[inner_index+1]`, stepping `inner_index += 1`.",
  },
};

export const actualMockQuestions = mockQuestions.map((q) => {
  const ov = OVERRIDES[q.id];
  return {
    ...q,
    ...ov,
    id: q.id.replace('mock-', 'actual-'),
    source: 'actual',
    images: ov ? (ov.images ?? []) : (IMAGES[q.id] || []),
    stem: ov?.stem ?? (STEMS[q.id] || q.stem),
    code: ov?.code ?? null, // non-overridden questions show the code in the image
  };
});
