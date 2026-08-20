// The 21 official DDW mock-final questions, transcribed from the verified
// worked solutions (DDW_02_Mock_Solutions.md). Answers live server-side only.
//
// Question schema:
//   id, source ('mock'|'predicted'), part (1|2|3), seq, topic, points, type,
//   examOdds (0-100 satirical "appears on the real final" chance),
//   stem (markdown-ish), code (optional monospace block),
//   payload (type-specific), answer (type-specific, never sent to client),
//   explanation (revealed after answering)
//
// Types: numeric | mcq | multiselect | dropdowns | matching | ordering

export const mockQuestions = [
  {
    id: 'mock-q1',
    source: 'mock', part: 1, seq: 1, topic: 'Sorting · insertion sort', points: 3,
    type: 'dropdowns', examOdds: 64,
    stem: "**Code completion.** This `insertion_sort` prints its array once per outer iteration. For `array = [3, 5, 1, 2]` the output is:\n\n```\narray: [3, 5, 1, 2]\narray: [3, 5, 2, 1]\narray: [3, 5, 2, 1]\narray: [5, 3, 2, 1]\n```\n\nFour prints, and the final array is **descending**. Fill the blanks so the code produces exactly this.",
    code:
`def insertion_sort(array):
    n = len(array)
    for outer_index in range( ⟨b1⟩ , ⟨b2⟩ , ⟨b3⟩ ):
        inner_index = outer_index
        while (inner_index < n-1 and
               array[inner_index] < array[inner_index+1]):
            temp = array[inner_index]
            array[inner_index] = array[inner_index+1]
            array[inner_index+1] = temp
            inner_index += ⟨b4⟩
        print("array:", array)`,
    payload: {
      blanks: [
        { id: 'b1', label: 'range start', options: ['0', 'n-1', 'n', '1', 'n-2'] },
        { id: 'b2', label: 'range stop', options: ['0', '-1', 'n', 'n-1'] },
        { id: 'b3', label: 'range step', options: ['1', '-1', '2', '-2'] },
        { id: 'b4', label: 'inner step', options: ['1', '-1', '2', '0'] },
      ],
    },
    answer: { b1: 'n-1', b2: '-1', b3: '-1', b4: '1' },
    explanation: "Count the printed lines (4) to get the outer-loop count → `range(n-1, -1, -1)` = `[3,2,1,0]`. The descending result plus the `array[i] < array[i+1]` comparison means it pushes larger elements rightward. `inner_index += 1` walks the swap toward the tail.",
  },

  {
    id: 'mock-q2',
    source: 'mock', part: 1, seq: 2, topic: 'Sorting · swap cost', points: 3,
    type: 'dropdowns', examOdds: 58,
    stem: "**Swap cost.** Cost = 1 per swap, everything else free. For each array, which is cheaper: unoptimised **bubble sort** or unoptimised **insertion sort**?",
    code: null,
    payload: {
      blanks: [
        { id: 'b1', label: '(i)  [5, 4, 3, 2, 1]', options: ['Bubble', 'Insertion', 'Both the same'] },
        { id: 'b2', label: '(ii) [1, 2, 3, 4, 5]', options: ['Bubble', 'Insertion', 'Both the same'] },
        { id: 'b3', label: '(iii) [3, 1, 5, 4, 2]', options: ['Bubble', 'Insertion', 'Both the same'] },
      ],
    },
    answer: { b1: 'Both the same', b2: 'Both the same', b3: 'Both the same' },
    explanation: "Both algorithms only ever swap **adjacent** elements, and each adjacent swap fixes exactly one inversion. So swap count = inversion count for both, always. They differ in *comparisons*, never in swaps. (Inversions: 10, 0, 5 — identical for both sorts.)",
  },

  {
    id: 'mock-q3',
    source: 'mock', part: 2, seq: 3, topic: 'Heaps · build_max_heap', points: 6,
    type: 'dropdowns', examOdds: 80,
    stem: "**Heap trace.** Run `build_max_heap` on `array = [10, 5, 13, 1, 3, 21, 7]` (a complete binary tree read level-by-level). Give the array **after** `build_max_heap`, then the number of times `build_max_heap` **calls** `max_heapify`.\n\n*Index reminders: children of `i` are `2i+1`, `2i+2`; first non-leaf is `n//2 − 1`.*",
    code: null,
    payload: {
      blanks: [
        { id: 'a0', label: 'array[0]', options: ['10', '5', '13', '1', '3', '21', '7'] },
        { id: 'a1', label: 'array[1]', options: ['10', '5', '13', '1', '3', '21', '7'] },
        { id: 'a2', label: 'array[2]', options: ['10', '5', '13', '1', '3', '21', '7'] },
        { id: 'a3', label: 'array[3]', options: ['10', '5', '13', '1', '3', '21', '7'] },
        { id: 'a4', label: 'array[4]', options: ['10', '5', '13', '1', '3', '21', '7'] },
        { id: 'a5', label: 'array[5]', options: ['10', '5', '13', '1', '3', '21', '7'] },
        { id: 'a6', label: 'array[6]', options: ['10', '5', '13', '1', '3', '21', '7'] },
        { id: 'calls', label: '# calls by build_max_heap', options: ['1', '2', '3', '4', '5'] },
      ],
    },
    answer: { a0: '21', a1: '5', a2: '13', a3: '1', a4: '3', a5: '10', a6: '7', calls: '3' },
    explanation: "`n=7`, start at `7//2 − 1 = 2`, loop `i = 2,1,0`. i=2: 13↔21 → `[10,5,21,1,3,13,7]`. i=1: 5 already largest. i=0: 10↔21, then max_heapify recurses at idx 2 (10↔13) → `[21,5,13,1,3,10,7]`. **The trap:** there were 4 total max_heapify *executions*, but one was max_heapify calling *itself*. build_max_heap's loop ran **3** times → answer 3.",
  },

  {
    id: 'mock-q4',
    source: 'mock', part: 2, seq: 4, topic: 'Recursion · code trace', points: 3,
    type: 'mcq', examOdds: 44,
    stem: "**Code trace.** `g` is a trial-division primality test, so `f(n)` is True for primes (and 1, 2, 3). The intended version of `w` filters the list to primes. Pick `BLANK1`/`BLANK2` so the assert passes — i.e. so `o[-1]` is the largest prime below `BLANK1`.",
    code:
`def f(n):        return g(2, n)
def g(d, n):
    if (d*d) > n:      return True
    elif n % d == 0:   return False
    else:              return g(d+1, n)
def w(p, r):
    ...                              # keeps only values where p(i) is True
    return r
o = w(f, list(range(1, BLANK1)))
assert o[-1] == BLANK2`,
    payload: {
      options: [
        { key: 'A', text: 'BLANK1 = 5,  BLANK2 = 4' },
        { key: 'B', text: 'BLANK1 = 10, BLANK2 = 7' },
        { key: 'C', text: 'BLANK1 = 15, BLANK2 = 14' },
        { key: 'D', text: 'BLANK1 = 20, BLANK2 = 19' },
      ],
    },
    answer: { correct: 'B' },
    explanation: "`range(1, k)` is `[1..k-1]`, and the largest prime below 10 is **7**. Options A/C/D all use `k-1` (4, 14, 19) — none of which is prime except by the unfiltered-list trap. Only B (10 → 7) is consistent with a prime filter. ⚠️ As literally transcribed the mock's `w` mutates a list while iterating (infinite loop); verify line 16 on your own photo — most likely it's `r.remove(i)` or a `break`.",
  },

  {
    id: 'mock-q5',
    source: 'mock', part: 1, seq: 5, topic: 'OOP · abstract base classes', points: 2,
    type: 'mcq', examOdds: 56,
    stem: "**Abstract base classes.** Given the classes below, which option does **NOT** cause an error?",
    code:
`import abc
class Foo(abc.ABC):
    @abc.abstractmethod
    def f1(self, x): pass
    @abc.abstractmethod
    def f2(self, y, z): pass
class Bar(Foo):
    def f1(self, x): return x*x
class Baz(Bar):
    def f2(self, y, z): return self.f1(y) - self.f1(z)
class Qux(Baz):
    def f1(self, x): return x+x`,
    payload: {
      options: [
        { key: 'A', text: 'assert Foo().f1(10) is None' },
        { key: 'B', text: 'assert Bar().f1(10) == 100' },
        { key: 'C', text: 'assert Baz().f2(10, 5) == 75' },
        { key: 'D', text: 'assert Qux().f2(10, 5) == 75' },
      ],
    },
    answer: { correct: 'C' },
    explanation: "A: `Foo` is abstract → TypeError. B: `Bar` implements `f1` but not `f2` → still abstract → TypeError. **C: `Baz` implements both → `10² − 5² = 75` ✓.** D: `Qux` overrides `f1` to `x+x`, so via dynamic dispatch `f2` gives `20 − 10 = 10 ≠ 75` → AssertionError.",
  },

  {
    id: 'mock-q6',
    source: 'mock', part: 2, seq: 6, topic: 'OOP · inheritance & super()', points: 3,
    type: 'multiselect', examOdds: 68,
    stem: "**Inheritance & super().** Given the code, select **every** correct statement.",
    code:
`class A:
    def __init__(self):
        self.attribute_1 = "abc"
        self.attribute_2 = "xyz"
    def foo(self, value):
        print(f"Object A has {value}")
class B(A):
    def __init__(self):
        self.attribute_3 = "123"
        self.attribute_4 = "456"
    def foo(self, key, value):
        super().foo(key)
        print(f"Object B has {key} and {value}")
a = A(); b = B()
print(b.foo('key', 'value'))`,
    payload: {
      options: [
        { key: 'A', text: '`a` does NOT have attribute_3 / attribute_4' },
        { key: 'B', text: '`b` inherits attribute_1 / attribute_2 from A' },
        { key: 'C', text: 'the output is exactly "Object B has key and value"' },
        { key: 'D', text: 'the output is "Object A has key" then "Object B has key and value"' },
        { key: 'E', text: 'the output starts "Object A has value ..."' },
      ],
    },
    answer: { correct: ['A', 'D'] },
    explanation: "A ✓ attributes flow parent→child only. B ✗ `B.__init__` never calls `super().__init__()`, so b never gets attribute_1/2. C ✗ incomplete — the `super().foo(key)` line prints first. **D ✓.** E ✗ `super().foo(key)` passes `key`, not `value`. (Most-tested fact: methods are inherited automatically; attributes only if `__init__` calls `super().__init__()`.)",
  },

  {
    id: 'mock-q7',
    source: 'mock', part: 3, seq: 7, topic: 'Graphs · topological sort', points: 6,
    type: 'ordering', examOdds: 74,
    stem: "**Topological sort** (reverse DFS finishing order, exploring children alphabetically, then sweeping remaining nodes alphabetically). Order all 11 nodes.\n\nEdges: `A→B, A→E, B→C, K→C, C→D, E→F, F→D, F→G, I→G, J→I, D→H, G→H`\n\n*Worked hint from the paper: for A→B, A→C starting at A, the output is A, C, B — so it's reverse-finishing-order, not visit order.*",
    code: null,
    payload: {
      items: [
        { id: 'A', text: 'A' }, { id: 'B', text: 'B' }, { id: 'C', text: 'C' },
        { id: 'D', text: 'D' }, { id: 'E', text: 'E' }, { id: 'F', text: 'F' },
        { id: 'G', text: 'G' }, { id: 'H', text: 'H' }, { id: 'I', text: 'I' },
        { id: 'J', text: 'J' }, { id: 'K', text: 'K' },
      ],
    },
    answer: { order: ['K', 'J', 'I', 'A', 'E', 'F', 'G', 'B', 'C', 'D', 'H'] },
    explanation: "DFS from A (alphabetical children), prepend each node as it finishes: finish order `H,D,C,B,G,F,E,A,I,J,K`. Reverse → **K,J,I,A,E,F,G,B,C,D,H**. Every one of the 12 edges points forward in this ordering. Method: run DFS, write each node at the FRONT of your list as it finishes, then read left→right.",
  },

  {
    id: 'mock-q8',
    source: 'mock', part: 1, seq: 8, topic: 'State-space search', points: 2,
    type: 'multiselect', examOdds: 41,
    stem: "**State-space search.** Select every CORRECT statement.",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'It finds a sequence of actions from the start state to the goal state' },
        { key: 'B', text: 'Each node represents a state of the state machine' },
        { key: 'C', text: 'Each edge represents an action of the state machine' },
        { key: 'D', text: 'BFS can be used to solve it' },
      ],
    },
    answer: { correct: ['A', 'B', 'C', 'D'] },
    explanation: "All four are true — a free 2 points. Week 8 turns a state machine into a graph (states = nodes, actions = edges) and runs graph search on it. BFS is preferred because it finds the *shortest* action sequence.",
  },

  {
    id: 'mock-q9',
    source: 'mock', part: 1, seq: 9, topic: 'Pandas · DataFrame vs Series', points: 2,
    type: 'matching', examOdds: 61,
    stem: "**Pandas.** Match each statement to its printed output, given this DataFrame `df`:\n\n```\n   Item        Category     Price  Stocks\n0  Pen         Stationery       1     500\n1  Shoe        Fashion         35      12\n2  Frying Pan  Kitchen         65      16\n3  Spatula     Kitchen          9      25\n4  Laptop      Technology    1200       8\n```",
    code: null,
    payload: {
      left: [
        { id: 'l1', text: 'print(df.shape)' },
        { id: 'l2', text: "print(df.loc[1, 'Item'])" },
        { id: 'l3', text: 'print(isinstance(df, pd.Series))' },
        { id: 'l4', text: "print(isinstance(df['Item'], pd.Series))" },
      ],
      options: ['(5, 4)', '(4, 5)', 'Shoe', 'Pen', 'True', 'False'],
    },
    answer: { l1: '(5, 4)', l2: 'Shoe', l3: 'False', l4: 'True' },
    explanation: "`.shape` = (rows, cols) excluding index/header → (5, 4). `df.loc[1, 'Item']` = row-label 1 → 'Shoe'. A whole DataFrame is never a Series → False. `df['col']` is a Series (1-D) → True.",
  },

  {
    id: 'mock-q10',
    source: 'mock', part: 2, seq: 10, topic: 'Confusion matrix', points: 3,
    type: 'multiselect', examOdds: 63,
    stem: "**Multi-class confusion matrix** (rows = actual, columns = predicted). Select every CORRECT statement.\n\n```\n            Pred: TigerWhale  Shark  Humpback\nTigerWhale       20            6        1\nShark             3            8        1\nHumpback          4            2       10\n```",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'Overall accuracy is 69%' },
        { key: 'B', text: 'Tiger Whale has lower sensitivity than Shark' },
        { key: 'C', text: 'Shark has the lowest precision' },
        { key: 'D', text: 'You must train TWO models to classify all three categories' },
      ],
    },
    answer: { correct: ['A', 'C'] },
    explanation: "Accuracy = 38/55 = 69% ✓A. Sensitivity (÷ ROW): TW 20/27=0.74, Shark 8/12=0.67 → TW is *higher*, so B ✗. Precision (÷ COLUMN): TW 0.74, Shark 8/16=0.50, Humpback 0.83 → Shark lowest ✓C. One-vs-all with 3 classes needs **3** models, not 2 → D ✗.",
  },

  {
    id: 'mock-q11',
    source: 'mock', part: 2, seq: 11, topic: 'Numpy · cost function shape', points: 3,
    type: 'mcq', examOdds: 60,
    stem: "**Numpy cost function.** Which expression fills the blank so the code runs and returns the correct cost?",
    code:
`def compute_cost(X, y, beta):
    m = X.shape[0]
    error = calc_linear(X, beta) - y     # shape (m, 1)
    error_sq = ______________
    J = (1/(2*m)) * error_sq
    J = J[0][0]                           # <-- the tell
    return J`,
    payload: {
      options: [
        { key: 'A', text: 'np.matmul(error, error.T)' },
        { key: 'B', text: 'np.matmul(error.T, error)' },
        { key: 'C', text: 'np.sum((error)*2)' },
        { key: 'D', text: 'np.sum((error)**2)' },
      ],
    },
    answer: { correct: 'B' },
    explanation: "`J = J[0][0]` proves `J` must be 2-D, killing the scalar options C and D. `error` is (m,1): `errorᵀ·error` → (1,m)·(m,1) = **(1,1) = Σerror²** ✓. `error·errorᵀ` → (m,m) ✗. Rule: transpose FIRST.",
  },

  {
    id: 'mock-q12',
    source: 'mock', part: 1, seq: 12, topic: 'Data visualisation', points: 2,
    type: 'multiselect', examOdds: 52,
    stem: "**Data visualisation.** Select every CORRECT statement.",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'A boxplot shows min, max, Q1, Q3, median and outliers' },
        { key: 'B', text: 'A scatter plot shows the relationship between 2 variables' },
        { key: 'C', text: 'A histogram visualises the distribution of qualitative data' },
        { key: 'D', text: 'IQR = 1.5 × (Q3 − Q1)' },
      ],
    },
    answer: { correct: ['A', 'B'] },
    explanation: "A ✓, B ✓. C ✗ histograms are for **quantitative** data (use a countplot for categorical). D ✗ **IQR = Q3 − Q1**; the 1.5× is the whisker/outlier rule, not the IQR itself.",
  },

  {
    id: 'mock-q13',
    source: 'mock', part: 1, seq: 13, topic: 'Linear regression metrics', points: 2,
    type: 'multiselect', examOdds: 57,
    stem: "**⚠️ Polarity check — select the INCORRECT statements** about linear regression metrics.",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'R² can be negative' },
        { key: 'B', text: 'A larger MSE means a worse model' },
        { key: 'C', text: 'The closer R² is to zero, the better' },
        { key: 'D', text: 'A model is definitely good if MSE ≈ 0.1–0.15' },
      ],
    },
    answer: { correct: ['C', 'D'] },
    explanation: "A and B are TRUE (so not selected). **C is FALSE** — closer to **1** is better. **D is FALSE** — MSE is in *squared units of y*, so 'small' is meaningless without knowing y's scale. Select C and D.",
  },

  {
    id: 'mock-q14',
    source: 'mock', part: 1, seq: 14, topic: 'Polynomial regression', points: 2,
    type: 'multiselect', examOdds: 50,
    stem: "**Polynomial linear regression.** Select every CORRECT statement.",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'x and y can have a non-linear relation in the hypothesis' },
        { key: 'B', text: 'Gradient descent can find optimal β₀…βₙ' },
        { key: 'C', text: 'A higher degree n is always better' },
        { key: 'D', text: 'Simple linear regression is a special case with n = 1' },
      ],
    },
    answer: { correct: ['A', 'B', 'D'] },
    explanation: "A ✓ 'linear' refers to linearity in the *coefficients* β, not in x. B ✓. **C ✗ overfitting** — higher degree is not always better. D ✓.",
  },

  {
    id: 'mock-q15',
    source: 'mock', part: 2, seq: 15, topic: 'Logistic regression · gradient descent', points: 3,
    type: 'numeric', examOdds: 71,
    stem: "**One step of logistic gradient descent.** `p = 1/(1+e^(−Xb))`, `b := b − α(1/m)Xᵀ(p − y)`, with α = 0.1, b₀ = 0, b₁ = 1, m = 4.\n\n| x₁ | y |\n|---|---|\n| 1 | 0 |\n| 2 | 0 |\n| 7 | 1 |\n| 9 | 1 |\n\nCompute **b₀** after one update (2 d.p.).",
    code: null,
    payload: { placeholder: 'e.g. -0.04', decimals: 2 },
    answer: { value: -0.04, tolerance: 0.011 },
    explanation: "With b₀=0, b₁=1, z = x₁. p = σ(1),σ(2),σ(7),σ(9) = 0.731,0.881,0.999,1.000. Σ(p−y) = 0.731+0.881−0.001−0.000 ≈ 1.611. α(1/m) = 0.025. b₀ = 0 − 0.025×1.611 = **−0.04**.",
  },

  {
    id: 'mock-q16',
    source: 'mock', part: 2, seq: 16, topic: 'Logistic regression · gradient descent', points: 3,
    type: 'numeric', examOdds: 71,
    stem: "**Same setup as the previous question** (α = 0.1, b₀ = 0, b₁ = 1, m = 4; points (1,0),(2,0),(7,1),(9,1)). Compute **b₁** after one update (2 d.p.).",
    code: null,
    payload: { placeholder: 'e.g. 0.94', decimals: 2 },
    answer: { value: 0.94, tolerance: 0.011 },
    explanation: "Σx₁(p−y) = 1(0.731)+2(0.881)+7(−0.001)+9(−0.000) ≈ 2.485. α(1/m)=0.025. b₁ = 1 − 0.025×2.485 = **0.94**.",
  },

  {
    id: 'mock-q17',
    source: 'mock', part: 1, seq: 17, topic: 'Linear regression · prediction', points: 1,
    type: 'numeric', examOdds: 82,
    stem: "**Prediction chain.** Trained model `ŷ = 2x + 1`. Test set: (2,5), (3,10), (4,9).\n\nWhat is `ŷ(2)`?",
    code: null,
    payload: { placeholder: 'e.g. 5', decimals: 0 },
    answer: { value: 5, tolerance: 0.001 },
    explanation: "ŷ(2) = 2(2) + 1 = **5**.",
  },

  {
    id: 'mock-q18',
    source: 'mock', part: 1, seq: 18, topic: 'Linear regression · prediction', points: 1,
    type: 'numeric', examOdds: 82,
    stem: "**Same model** `ŷ = 2x + 1`, test set (2,5),(3,10),(4,9). What is `ŷ(3)`?",
    code: null,
    payload: { placeholder: 'e.g. 7', decimals: 0 },
    answer: { value: 7, tolerance: 0.001 },
    explanation: "ŷ(3) = 2(3) + 1 = **7**.",
  },

  {
    id: 'mock-q19',
    source: 'mock', part: 1, seq: 19, topic: 'Linear regression · prediction', points: 1,
    type: 'numeric', examOdds: 82,
    stem: "**Same model** `ŷ = 2x + 1`, test set (2,5),(3,10),(4,9). What is `ŷ(4)`?",
    code: null,
    payload: { placeholder: 'e.g. 9', decimals: 0 },
    answer: { value: 9, tolerance: 0.001 },
    explanation: "ŷ(4) = 2(4) + 1 = **9**.",
  },

  {
    id: 'mock-q20',
    source: 'mock', part: 2, seq: 20, topic: 'Linear regression · MSE', points: 2,
    type: 'numeric', examOdds: 76,
    stem: "**Same setup** `ŷ = 2x + 1`, test set (2,5),(3,10),(4,9). Predictions are ŷ = 5, 7, 9. Compute the **MSE** over the 3 test points.",
    code: null,
    payload: { placeholder: 'e.g. 3', decimals: 2 },
    answer: { value: 3, tolerance: 0.02 },
    explanation: "Residuals y−ŷ = 0, 3, 0 → squares 0, 9, 0 → SS_res = 9. MSE = 9/3 = **3**.",
  },

  {
    id: 'mock-q21',
    source: 'mock', part: 3, seq: 21, topic: 'Linear regression · R²', points: 2,
    type: 'numeric', examOdds: 76,
    stem: "**Same setup** (ŷ = 5,7,9; actual y = 5,10,9). Compute **R²** on the 3 test points (2 d.p.).",
    code: null,
    payload: { placeholder: 'e.g. 0.36', decimals: 2 },
    answer: { value: 0.36, tolerance: 0.011 },
    explanation: "ȳ = (5+10+9)/3 = 8. SS_tot = (−3)²+2²+1² = 14. SS_res = 9. R² = 1 − 9/14 = **0.36**. ⚠️ Use raw sums (do NOT divide by n); SS_tot uses ȳ of the ACTUAL y.",
  },
];
