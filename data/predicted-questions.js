// "Predicted Paper" — similar / potential questions mined from the verified
// DDW practice bank (DDW_03_Practice_Bank.md), the exact same exam formats.
// Every answer is taken from the practice bank's Answer Key.
//
// Same schema as mock-questions.js. Extra type used here: `text`
//   text answer: { accept: ['(4, 4)', '(4,4)'] }  // any normalized match passes

export const predictedQuestions = [
  // ───────────────────────── LINEAR REGRESSION ARITHMETIC ─────────────────────────
  {
    id: 'pred-a1', source: 'predicted', part: 1, seq: 101, topic: 'Linear regression · prediction', points: 1,
    type: 'numeric', examOdds: 78,
    stem: "Trained model `ŷ = 3x − 2`. Test set: (1,2), (2,5), (3,6), (5,12). What is `ŷ(1)`?",
    code: null, payload: { placeholder: 'e.g. 1', decimals: 0 },
    answer: { value: 1, tolerance: 0.001 },
    explanation: "ŷ(1) = 3(1) − 2 = **1**.",
  },
  {
    id: 'pred-a3', source: 'predicted', part: 2, seq: 102, topic: 'Linear regression · MSE', points: 2,
    type: 'numeric', examOdds: 74,
    stem: "Model `ŷ = 3x − 2`, test set (1,2),(2,5),(3,6),(5,12). Compute the **MSE** over all 4 points.",
    code: null, payload: { placeholder: 'e.g. 1', decimals: 2 },
    answer: { value: 1, tolerance: 0.02 },
    explanation: "Predictions [1,4,7,13]; residuals [1,1,−1,−1]; squares [1,1,1,1] → SS_res = 4; MSE = 4/4 = **1**.",
  },
  {
    id: 'pred-a6', source: 'predicted', part: 3, seq: 103, topic: 'Linear regression · R²', points: 2,
    type: 'numeric', examOdds: 72,
    stem: "Model `ŷ = 3x − 2`, test set (1,2),(2,5),(3,6),(5,12). Compute **R²** (2 d.p.). *(SS_res = 4, ȳ = 6.25.)*",
    code: null, payload: { placeholder: 'e.g. 0.92', decimals: 2 },
    answer: { value: 0.92, tolerance: 0.011 },
    explanation: "SS_tot = (2−6.25)²+(5−6.25)²+(6−6.25)²+(12−6.25)² = 18.06+1.56+0.06+33.06 = 52.75. R² = 1 − 4/52.75 = **0.92**.",
  },
  {
    id: 'pred-a7', source: 'predicted', part: 1, seq: 104, topic: 'Multiple linear regression', points: 2,
    type: 'numeric', examOdds: 66,
    stem: "A multiple linear regression model is `ŷ = 1 + 2x₁ − 3x₂`. What is the prediction at (x₁, x₂) = (4, 2)?",
    code: null, payload: { placeholder: 'e.g. 3', decimals: 0 },
    answer: { value: 3, tolerance: 0.001 },
    explanation: "1 + 2(4) − 3(2) = 1 + 8 − 6 = **3**.",
  },
  {
    id: 'pred-a9', source: 'predicted', part: 2, seq: 105, topic: 'Normalisation · z-score', points: 2,
    type: 'numeric', examOdds: 64,
    stem: "A training feature column is `[2, 4, 6, 8]`. Using `normalize_z` (population σ, as `np.std` uses by default), what is the normalised value of the point `8`? (2 d.p.)",
    code: null, payload: { placeholder: 'e.g. 1.34', decimals: 2 },
    answer: { value: 1.34, tolerance: 0.02 },
    explanation: "μ = 5, σ = √((9+1+1+9)/4) = √5 = 2.2361. (8 − 5)/2.2361 = **1.34**.",
  },
  {
    id: 'pred-a11', source: 'predicted', part: 2, seq: 106, topic: 'Linear regression · cost J(b)', points: 2,
    type: 'numeric', examOdds: 62,
    stem: "`X = [[1,1],[1,2],[1,3]]`, `y = [[2],[4],[5]]`, `b = [[0],[1]]`, m = 3, and `J(b) = (1/2m)·Σ(ŷ − y)²`. Compute **J(b)** (2 d.p.).",
    code: null, payload: { placeholder: 'e.g. 1.50', decimals: 2 },
    answer: { value: 1.50, tolerance: 0.02 },
    explanation: "ŷ = Xb = [1,2,3]; error = ŷ−y = [−1,−2,−2]; Σerror² = 1+4+4 = 9; J = 9/(2×3) = **1.50**.",
  },
  {
    id: 'pred-a12', source: 'predicted', part: 2, seq: 107, topic: 'Linear regression · gradient step', points: 2,
    type: 'numeric', examOdds: 60,
    stem: "Same setup as before (X=[[1,1],[1,2],[1,3]], y=[[2],[4],[5]], b=[[0],[1]], m=3). Using `b := b − α(1/m)Xᵀ(ŷ − y)` with α = 0.1, compute **b₁** after one update (2 d.p.).",
    code: null, payload: { placeholder: 'e.g. 1.37', decimals: 2 },
    answer: { value: 1.37, tolerance: 0.02 },
    explanation: "gradient row 2 (x column) = (1·−1 + 2·−2 + 3·−2)/3 = −11/3 = −3.6667. b₁ = 1 − 0.1(−3.6667) = **1.37**.",
  },

  // ───────────────────────── LOGISTIC REGRESSION ─────────────────────────
  {
    id: 'pred-b13', source: 'predicted', part: 2, seq: 110, topic: 'Sigmoid values', points: 3,
    type: 'matching', examOdds: 65,
    stem: "**Match each `z` to `σ(z) = 1/(1+e^(−z))`** (4 d.p.).",
    code: null,
    payload: {
      left: [
        { id: 'z0', text: 'σ(0)' }, { id: 'z1', text: 'σ(1)' }, { id: 'zm1', text: 'σ(−1)' },
        { id: 'z2', text: 'σ(2)' }, { id: 'zm2', text: 'σ(−2)' }, { id: 'z3', text: 'σ(3)' },
      ],
      options: ['0.1192', '0.2689', '0.5000', '0.7311', '0.8808', '0.9526'],
    },
    answer: { z0: '0.5000', z1: '0.7311', zm1: '0.2689', z2: '0.8808', zm2: '0.1192', z3: '0.9526' },
    explanation: "σ(0)=0.5, σ(1)=0.7311, σ(−1)=0.2689 (= 1−σ(1)), σ(2)=0.8808, σ(−2)=0.1192, σ(3)=0.9526.",
  },
  {
    id: 'pred-b14', source: 'predicted', part: 1, seq: 111, topic: 'Sigmoid properties', points: 2,
    type: 'multiselect', examOdds: 55,
    stem: "Which statement(s) about the sigmoid function is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'σ(z) always lies strictly between 0 and 1' },
        { key: 'B', text: 'σ(0) = 0.5' },
        { key: 'C', text: 'σ(−z) = 1 − σ(z)' },
        { key: 'D', text: 'σ(z) outputs a class label (0 or 1)' },
      ],
    },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — sigmoid outputs a *probability*; `predict_class` applies the 0.5 threshold to get a label.",
  },
  {
    id: 'pred-b16', source: 'predicted', part: 2, seq: 112, topic: 'Logistic regression · gradient step', points: 3,
    type: 'numeric', examOdds: 63,
    stem: "Logistic regression, α = 0.2, initial b₀ = 0, b₁ = 0, m = 3, data (x₁,y): (1,0),(2,1),(3,1). Compute **b₀** after the first update (4 d.p.). *(Hint: b = 0 ⇒ p = 0.5 everywhere.)*",
    code: null, payload: { placeholder: 'e.g. 0.0333', decimals: 4 },
    answer: { value: 0.0333, tolerance: 0.0005 },
    explanation: "p = 0.5 for all. p−y = [0.5, −0.5, −0.5], Σ = −0.5. α(1/m) = 0.2/3 = 0.06667. b₀ = 0 − 0.06667(−0.5) = **0.0333**.",
  },
  {
    id: 'pred-b17', source: 'predicted', part: 2, seq: 113, topic: 'Logistic regression · gradient step', points: 3,
    type: 'numeric', examOdds: 63,
    stem: "Same setup (α = 0.2, b₀ = b₁ = 0, m = 3, data (1,0),(2,1),(3,1)). Compute **b₁** after the first update (4 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.1333', decimals: 4 },
    answer: { value: 0.1333, tolerance: 0.0005 },
    explanation: "Σx₁(p−y) = 1(0.5)+2(−0.5)+3(−0.5) = −2.0. b₁ = 0 − 0.06667(−2.0) = **0.1333**.",
  },

  // ───────────────────────── CONFUSION MATRIX ─────────────────────────
  {
    id: 'pred-c21', source: 'predicted', part: 1, seq: 120, topic: 'Confusion matrix · accuracy', points: 2,
    type: 'numeric', examOdds: 66,
    stem: "2×2 matrix (rows = actual, cols = predicted, positive first): TP=45, FN=5, FP=10, TN=40. Compute **accuracy** (2 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.85', decimals: 2 },
    answer: { value: 0.85, tolerance: 0.011 },
    explanation: "Accuracy = (TP+TN)/total = (45+40)/100 = **0.85**.",
  },
  {
    id: 'pred-c24', source: 'predicted', part: 1, seq: 121, topic: 'Confusion matrix · precision', points: 2,
    type: 'numeric', examOdds: 64,
    stem: "Same matrix (TP=45, FN=5, FP=10, TN=40). Compute **precision** (2 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.82', decimals: 2 },
    answer: { value: 0.82, tolerance: 0.011 },
    explanation: "Precision = TP/(TP+FP) = 45/55 = 0.8182 → **0.82**.",
  },
  {
    id: 'pred-c25', source: 'predicted', part: 2, seq: 122, topic: 'Confusion matrix · interpretation', points: 3,
    type: 'multiselect', examOdds: 58,
    stem: "Same matrix (TP=45, FN=5, FP=10, TN=40). Which statement(s) is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'It misses 5 actual positives' },
        { key: 'B', text: 'It raises 10 false alarms' },
        { key: 'C', text: 'Its specificity is higher than its sensitivity' },
        { key: 'D', text: 'Precision would improve if the threshold were raised above 0.5' },
      ],
    },
    answer: { correct: ['A', 'B'] },
    explanation: "A ✓ (FN=5), B ✓ (FP=10). C ✗ sensitivity 0.90 > specificity 0.80. D ✗ raising the threshold *usually* raises precision but is not guaranteed, and nothing here gives the score distribution — leave it unselected.",
  },
  {
    id: 'pred-c26', source: 'predicted', part: 1, seq: 123, topic: 'Confusion matrix · accuracy (multi-class)', points: 2,
    type: 'numeric', examOdds: 60,
    stem: "3-class matrix (rows actual, cols predicted; X,Y,Z):\n\n```\n     X   Y   Z\nX   30   4   6\nY    5  25  10\nZ    2   3  15\n```\nCompute **overall accuracy** (2 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.70', decimals: 2 },
    answer: { value: 0.70, tolerance: 0.011 },
    explanation: "Diagonal = 30+25+15 = 70, total = 100. Accuracy = **0.70**.",
  },
  {
    id: 'pred-c28', source: 'predicted', part: 2, seq: 124, topic: 'Confusion matrix · precision (multi-class)', points: 2,
    type: 'numeric', examOdds: 58,
    stem: "Same 3-class matrix. Compute the **precision of class Z** (4 d.p.). *(Precision = diagonal ÷ COLUMN sum.)*",
    code: null, payload: { placeholder: 'e.g. 0.4839', decimals: 4 },
    answer: { value: 0.4839, tolerance: 0.0005 },
    explanation: "Column Z = 6+10+15 = 31. Precision_Z = 15/31 = **0.4839**.",
  },

  // ───────────────────────── PANDAS / NUMPY / PLOTS ─────────────────────────
  {
    id: 'pred-d30', source: 'predicted', part: 1, seq: 130, topic: 'Pandas · .loc', points: 2,
    type: 'text', examOdds: 55,
    stem: "DataFrame `df` (rows Ana/Eng, Ben/Sales, Cara/Eng, Dan/HR at indices 0–3). What does `print(df.loc[2, 'dept'])` output?",
    code: null, payload: { placeholder: 'type the exact output' },
    answer: { accept: ['eng'] },
    explanation: "`df.loc[2, 'dept']` = row label 2, column 'dept' → **Eng**.",
  },
  {
    id: 'pred-d34', source: 'predicted', part: 1, seq: 131, topic: 'Pandas · Series vs DataFrame', points: 2,
    type: 'multiselect', examOdds: 60,
    stem: "Which statement(s) is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: "df['salary'] returns a pd.Series" },
        { key: 'B', text: "df[['salary']] returns a pd.DataFrame" },
        { key: 'C', text: '.loc selects by label, .iloc selects by integer position' },
        { key: 'D', text: 'df.shape includes the header row in its row count' },
      ],
    },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — `.shape` counts data rows only, never the header.",
  },
  {
    id: 'pred-d35', source: 'predicted', part: 2, seq: 132, topic: 'Numpy · shapes', points: 3,
    type: 'matching', examOdds: 56,
    stem: "Match each numpy expression to its resulting shape, given `a` has shape `(6, 1)` and `b` has shape `(6, 3)`.",
    code: null,
    payload: {
      left: [
        { id: 'r1', text: 'a.reshape(1, -1)' },
        { id: 'r2', text: 'np.matmul(a.T, a)' },
        { id: 'r3', text: 'np.matmul(a, a.T)' },
        { id: 'r4', text: 'np.concatenate((np.ones((6,1)), b), axis=1)' },
        { id: 'r5', text: 'np.mean(b, axis=0).reshape(1,-1)' },
      ],
      options: ['(1,6)', '(1,1)', '(6,6)', '(6,4)', '(1,3)', '(6,)'],
    },
    answer: { r1: '(1,6)', r2: '(1,1)', r3: '(6,6)', r4: '(6,4)', r5: '(1,3)' },
    explanation: "reshape(1,-1) → row (1,6). aᵀa → (1,6)(6,1)=(1,1). aaᵀ → (6,1)(1,6)=(6,6). concat ones+b → (6,1+3)=(6,4). mean over axis 0 of (6,3) → (3,) reshaped to (1,3).",
  },
  {
    id: 'pred-d37', source: 'predicted', part: 1, seq: 133, topic: 'Plots', points: 2,
    type: 'multiselect', examOdds: 52,
    stem: "Which statement(s) about plots is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'sns.histplot shows the distribution of a numerical variable' },
        { key: 'B', text: 'sns.boxplot shows median, quartiles and outliers' },
        { key: 'C', text: 'sns.countplot is appropriate for a categorical column such as diagnosis' },
        { key: 'D', text: 'sns.scatterplot(x=..., y=..., hue=...) encodes a third variable by colour' },
      ],
    },
    answer: { correct: ['A', 'B', 'C', 'D'] },
    explanation: "All four are correct.",
  },
  {
    id: 'pred-d38', source: 'predicted', part: 1, seq: 134, topic: 'Boxplot · IQR', points: 2,
    type: 'numeric', examOdds: 54,
    stem: "In a boxplot, Q1 = 12 and Q3 = 28. What is the **upper whisker limit** under the 1.5×IQR rule?",
    code: null, payload: { placeholder: 'e.g. 52', decimals: 0 },
    answer: { value: 52, tolerance: 0.01 },
    explanation: "IQR = 28 − 12 = 16. Upper whisker = Q3 + 1.5×IQR = 28 + 24 = **52**.",
  },

  // ───────────────────────── CODE-SHAPE BLANKS ─────────────────────────
  {
    id: 'pred-e39', source: 'predicted', part: 1, seq: 140, topic: 'Numpy · sum of squares', points: 2,
    type: 'multiselect', examOdds: 58,
    stem: "`error` has shape `(m,1)`. Which expression(s) correctly produce the sum of squared errors as a `(1,1)` array?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'np.matmul(error.T, error)' },
        { key: 'B', text: 'np.matmul(error, error.T)' },
        { key: 'C', text: 'np.sum(error ** 2)' },
        { key: 'D', text: 'error.T @ error' },
      ],
    },
    answer: { correct: ['A', 'D'] },
    explanation: "A and D both give (1,m)·(m,1) = (1,1). B gives (m,m). C gives a scalar, not a (1,1) array.",
  },
  {
    id: 'pred-e40', source: 'predicted', part: 2, seq: 141, topic: 'Gradient descent · blank', points: 3,
    type: 'dropdowns', examOdds: 60,
    stem: "Complete the gradient descent update so the gradient has shape `(n+1, 1)`:",
    code:
`error    = calc_linreg(X, beta) - y
gradient = (1/m) * np.matmul( ⟨b1⟩ , ⟨b2⟩ )
beta     = beta - alpha * gradient`,
    payload: {
      blanks: [
        { id: 'b1', label: 'first arg', options: ['X', 'X.T', 'error', 'error.T'] },
        { id: 'b2', label: 'second arg', options: ['X', 'X.T', 'error', 'error.T'] },
      ],
    },
    answer: { b1: 'X.T', b2: 'error' },
    explanation: "`np.matmul(X.T, error)` → (n+1, m)·(m, 1) = (n+1, 1) ✓. Transpose FIRST.",
  },
  {
    id: 'pred-e45', source: 'predicted', part: 1, seq: 142, topic: 'Logistic · predict_class', points: 2,
    type: 'dropdowns', examOdds: 56,
    stem: "Complete `predict_class` for logistic regression:",
    code:
`p = calc_logreg(X, beta)
return np.where(p ⟨b1⟩ , 1, 0)`,
    payload: {
      blanks: [
        { id: 'b1', label: 'threshold test', options: ['>= 0.5', '> 1', '== 1', '<= 0.5'] },
      ],
    },
    answer: { b1: '>= 0.5' },
    explanation: "Class 1 when probability ≥ 0.5: `np.where(p >= 0.5, 1, 0)`.",
  },
  {
    id: 'pred-e46', source: 'predicted', part: 1, seq: 143, topic: 'build_model · returned dict', points: 2,
    type: 'multiselect', examOdds: 50,
    stem: "`build_model_logreg` returns a `model` dict. Which key(s) does it contain?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: '"beta"' }, { key: 'B', text: '"means"' },
        { key: 'C', text: '"stds"' }, { key: 'D', text: '"accuracy"' },
      ],
    },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "The model dict carries the three things you need to predict later: **beta, means, stds**. Accuracy is computed at scoring time, not stored in the model.",
  },

  // ───────────────────────── STATE MACHINES ─────────────────────────
  {
    id: 'pred-f47', source: 'predicted', part: 1, seq: 150, topic: 'State machine · API', points: 2,
    type: 'multiselect', examOdds: 46,
    stem: "About the `StateMachine` base class, which is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'get_next_values(state, inp) returns a tuple (next_state, output)' },
        { key: 'B', text: 'step(inp) updates self.state and returns the output' },
        { key: 'C', text: 'transduce(inp_list) calls start() first, then steps through every input' },
        { key: 'D', text: 'A subclass that does not implement get_next_values can still be instantiated' },
      ],
    },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — `get_next_values` is abstract, so an unimplementing subclass raises TypeError.",
  },
  {
    id: 'pred-f50', source: 'predicted', part: 1, seq: 151, topic: 'State machine · trace', points: 2,
    type: 'numeric', examOdds: 44,
    stem: "`SimpleAccount`: `get_next_values(state, inp)` returns `state + inp − 5` if `inp < 0 and state < 100`, else `state + inp`. With `balance = 90`, what is the output after the single input `[-20]`?",
    code: null, payload: { placeholder: 'e.g. 65', decimals: 0 },
    answer: { value: 65, tolerance: 0.001 },
    explanation: "state 90 < 100 and inp < 0 → 90 − 20 − 5 = **65**.",
  },
  {
    id: 'pred-f53', source: 'predicted', part: 1, seq: 152, topic: 'State-space search', points: 2,
    type: 'multiselect', examOdds: 45,
    stem: "About state-space search, which is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'Nodes represent states, edges represent actions' },
        { key: 'B', text: 'BFS finds the shortest sequence of actions; DFS does not guarantee this' },
        { key: 'C', text: 'SearchNode.path() walks up the parent chain to rebuild the action sequence' },
        { key: 'D', text: 'Tracking visited states is optional — the search still terminates without it' },
      ],
    },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — without a visited set the search can revisit states forever on a cyclic graph.",
  },
  {
    id: 'pred-f54', source: 'predicted', part: 2, seq: 153, topic: 'sm_search · ordering', points: 3,
    type: 'ordering', examOdds: 48,
    stem: "**Put the steps of `sm_search` (BFS) into the correct order.**",
    code: null,
    payload: {
      items: [
        { id: 's1', text: 'Dequeue a node from the agenda' },
        { id: 's2', text: 'Return node.path() if the new state satisfies the goal test' },
        { id: 's3', text: 'Enqueue SearchNode(None, initial_state, None)' },
        { id: 's4', text: 'For each legal input, compute the next state via get_next_values' },
        { id: 's5', text: 'Skip the new state if already visited, otherwise enqueue it' },
        { id: 's6', text: 'Return [Step(None, initial_state)] immediately if the start is already the goal' },
      ],
    },
    answer: { order: ['s6', 's3', 's1', 's4', 's2', 's5'] },
    explanation: "Goal-check the start (6) → seed the agenda (3) → loop: dequeue (1) → expand inputs (4) → goal-test each new state (2) → enqueue if unseen (5).",
  },

  // ───────────────────────── CONCEPT BLITZ ─────────────────────────
  {
    id: 'pred-g55', source: 'predicted', part: 1, seq: 160, topic: 'Concept · R²', points: 2,
    type: 'multiselect', examOdds: 53,
    stem: "**Which statement(s) about R² is/are INCORRECT?**",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'R² = 1 means a perfect fit on that data' },
        { key: 'B', text: 'R² can be negative' },
        { key: 'C', text: 'R² is always between 0 and 1' },
        { key: 'D', text: 'R² compares the model against a baseline that always predicts ȳ' },
      ],
    },
    answer: { correct: ['C'] },
    explanation: "Only **C** is incorrect — R² can be negative, so it is not bounded below by 0. A, B, D are all true.",
  },
  {
    id: 'pred-g59', source: 'predicted', part: 1, seq: 161, topic: 'Concept · logistic regression', points: 2,
    type: 'multiselect', examOdds: 52,
    stem: "Which statement(s) about logistic regression is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'Its output is a probability, converted to a class by a threshold (usually 0.5)' },
        { key: 'B', text: 'It uses the same squared-error cost function as linear regression' },
        { key: 'C', text: 'Multi-class problems are handled by one binary classifier per class (one-vs-all)' },
        { key: 'D', text: "Its gradient update has the same form as linear regression's, with p in place of ŷ" },
      ],
    },
    answer: { correct: ['A', 'C', 'D'] },
    explanation: "A, C, D ✓. B ✗ — logistic regression uses log-loss / cross-entropy, because squared error is non-convex with the sigmoid.",
  },
  {
    id: 'pred-g60', source: 'predicted', part: 1, seq: 162, topic: 'Concept · confusion matrix', points: 2,
    type: 'multiselect', examOdds: 55,
    stem: "Which statement(s) about the confusion matrix is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'Sensitivity = diagonal ÷ row sum' },
        { key: 'B', text: 'Precision = diagonal ÷ column sum' },
        { key: 'C', text: 'Accuracy = sum of diagonal ÷ grand total' },
        { key: 'D', text: 'For a k-class problem the matrix is k × k' },
      ],
    },
    answer: { correct: ['A', 'B', 'C', 'D'] },
    explanation: "All four are correct. Sensitivity divides by the ROW; precision divides by the COLUMN.",
  },
  {
    id: 'pred-g62', source: 'predicted', part: 1, seq: 163, topic: 'Concept · big-O', points: 2,
    type: 'multiselect', examOdds: 51,
    stem: "**Which statement(s) about big-O is/are INCORRECT?**",
    code: null,
    payload: {
      options: [
        { key: 'A', text: "Bubble sort's worst case is O(n²)" },
        { key: 'B', text: 'Merge sort is O(n log n) in all cases' },
        { key: 'C', text: 'Binary heap max_heapify is O(log n)' },
        { key: 'D', text: "Insertion sort's best case is O(n²)" },
      ],
    },
    answer: { correct: ['D'] },
    explanation: "Only **D** is incorrect — insertion sort's best case (already-sorted input) is O(n). A, B, C are true.",
  },
  {
    id: 'pred-g63', source: 'predicted', part: 1, seq: 164, topic: 'Concept · super()', points: 2,
    type: 'multiselect', examOdds: 54,
    stem: "Which statement(s) about `super()` is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'super().__init__() runs the parent’s initialiser' },
        { key: 'B', text: "Without calling it, the subclass's instance does not get the parent's attributes" },
        { key: 'C', text: "super().foo(x) calls the parent's version of an overridden method" },
        { key: 'D', text: "super() gives access to the parent's private (__name-mangled) attributes" },
      ],
    },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — name mangling turns `__x` into `_ClassName__x`; `super()` doesn't bypass it.",
  },
  {
    id: 'pred-g64', source: 'predicted', part: 1, seq: 165, topic: 'Concept · abstract base classes', points: 2,
    type: 'multiselect', examOdds: 53,
    stem: "Which statement(s) about abstract base classes is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'A class with an unimplemented @abstractmethod cannot be instantiated' },
        { key: 'B', text: 'A subclass implementing only some abstract methods is still abstract' },
        { key: 'C', text: 'abc.ABC must be inherited from for @abstractmethod to be enforced' },
        { key: 'D', text: 'Abstract methods may still have a body that subclasses call via super()' },
      ],
    },
    answer: { correct: ['A', 'B', 'C', 'D'] },
    explanation: "All four are correct — including D: `@abstractmethod` can have an implementation body that subclasses invoke via `super()`.",
  },

  // ───────────────────────── SORTING & HEAPS ─────────────────────────
  {
    id: 'pred-h67', source: 'predicted', part: 1, seq: 170, topic: 'Sorting · inversions', points: 2,
    type: 'numeric', examOdds: 57,
    stem: "How many inversions are in `[4, 2, 7, 1, 3]`? *(This also equals the number of adjacent swaps unoptimised bubble sort performs.)*",
    code: null, payload: { placeholder: 'e.g. 6', decimals: 0 },
    answer: { value: 6, tolerance: 0.001 },
    explanation: "Inversions: (4,2),(4,1),(4,3),(2,1),(7,1),(7,3) = **6**. Swap count = inversion count.",
  },
  {
    id: 'pred-h71', source: 'predicted', part: 2, seq: 171, topic: 'Heaps · build_max_heap', points: 4,
    type: 'dropdowns', examOdds: 62,
    stem: "Run `build_max_heap([4, 10, 3, 5, 1])`. Give the resulting array and the number of `max_heapify` calls made by `build_max_heap`.",
    code: null,
    payload: {
      blanks: [
        { id: 'a0', label: 'array[0]', options: ['4', '10', '3', '5', '1'] },
        { id: 'a1', label: 'array[1]', options: ['4', '10', '3', '5', '1'] },
        { id: 'a2', label: 'array[2]', options: ['4', '10', '3', '5', '1'] },
        { id: 'a3', label: 'array[3]', options: ['4', '10', '3', '5', '1'] },
        { id: 'a4', label: 'array[4]', options: ['4', '10', '3', '5', '1'] },
        { id: 'calls', label: '# calls', options: ['1', '2', '3', '4'] },
      ],
    },
    answer: { a0: '10', a1: '5', a2: '3', a3: '4', a4: '1', calls: '2' },
    explanation: "n=5, start `5//2−1 = 1`, loop i = 1, 0 → 2 calls. i=1: 10 already largest. i=0: 4↔10, recurse idx1: 4↔5 → `[10,5,3,4,1]`. Result **[10,5,3,4,1]**, **2 calls**.",
  },
  {
    id: 'pred-h76', source: 'predicted', part: 2, seq: 172, topic: 'Complexity · matching', points: 3,
    type: 'matching', examOdds: 50,
    stem: "Match each algorithm to its worst-case time complexity. *(For `build_max_heap`, answer the course's O(n log n) derivation.)*",
    code: null,
    payload: {
      left: [
        { id: 'bubble', text: 'bubble sort (optimised)' },
        { id: 'insertion', text: 'insertion sort' },
        { id: 'merge', text: 'merge sort' },
        { id: 'heapsort', text: 'heapsort' },
        { id: 'heapify', text: 'max_heapify' },
      ],
      options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)', 'O(n³)'],
    },
    answer: { bubble: 'O(n²)', insertion: 'O(n²)', merge: 'O(n log n)', heapsort: 'O(n log n)', heapify: 'O(log n)' },
    explanation: "bubble & insertion O(n²); merge & heapsort O(n log n); max_heapify follows tree height → O(log n).",
  },

  // ───────────────────────── GRAPHS ─────────────────────────
  {
    id: 'pred-i77', source: 'predicted', part: 2, seq: 180, topic: 'Graphs · BFS', points: 3,
    type: 'ordering', examOdds: 55,
    stem: "Directed graph: `A→B, A→C, B→D, B→E, C→F, E→F, F→G`. Give the **BFS traversal order** from A, exploring neighbours alphabetically.",
    code: null,
    payload: {
      items: [
        { id: 'A', text: 'A' }, { id: 'B', text: 'B' }, { id: 'C', text: 'C' },
        { id: 'D', text: 'D' }, { id: 'E', text: 'E' }, { id: 'F', text: 'F' }, { id: 'G', text: 'G' },
      ],
    },
    answer: { order: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] },
    explanation: "BFS visits level by level: A → (B,C) → (D,E from B, F from C) → (G). Order **A, B, C, D, E, F, G**.",
  },
  {
    id: 'pred-i80', source: 'predicted', part: 3, seq: 181, topic: 'Graphs · topological sort', points: 3,
    type: 'ordering', examOdds: 60,
    stem: "Same graph `A→B, A→C, B→D, B→E, C→F, E→F, F→G`. Give the **topological sort** (reverse DFS finishing order, children alphabetical).",
    code: null,
    payload: {
      items: [
        { id: 'A', text: 'A' }, { id: 'B', text: 'B' }, { id: 'C', text: 'C' },
        { id: 'D', text: 'D' }, { id: 'E', text: 'E' }, { id: 'F', text: 'F' }, { id: 'G', text: 'G' },
      ],
    },
    answer: { order: ['A', 'C', 'B', 'E', 'F', 'G', 'D'] },
    explanation: "DFS finishing order D,G,F,E,B,C,A → reverse → **A, C, B, E, F, G, D**. Every edge points forward.",
  },
  {
    id: 'pred-i81', source: 'predicted', part: 1, seq: 182, topic: 'Graphs · DAG properties', points: 2,
    type: 'multiselect', examOdds: 48,
    stem: "For the graph `A→B, A→C, B→D, B→E, C→F, E→F, F→G`, which is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: 'It is a DAG, so a topological sort exists' },
        { key: 'B', text: 'G must appear after F in any valid topological order' },
        { key: 'C', text: 'D and G can appear in either relative order' },
        { key: 'D', text: 'A must be first in every valid topological order' },
      ],
    },
    answer: { correct: ['A', 'B', 'C', 'D'] },
    explanation: "All four true. A is the unique source (no incoming edge) so it must come first; D and G are unrelated by any path so their relative order is free.",
  },

  // ───────────────────────── OOP ─────────────────────────
  {
    id: 'pred-j83', source: 'predicted', part: 2, seq: 190, topic: 'OOP · inheritance', points: 3,
    type: 'multiselect', examOdds: 58,
    stem: "Given the classes, which is/are **CORRECT**?",
    code:
`class Vehicle:
    def __init__(self, wheels): self.wheels = wheels
    def describe(self): return f"{self.wheels} wheels"
class Car(Vehicle):
    def __init__(self): self.brand = "generic"
    def describe(self): return "Car: " + super().describe()
class Truck(Vehicle):
    def __init__(self):
        super().__init__(6)
        self.load = 1000`,
    payload: {
      options: [
        { key: 'A', text: 'Truck().wheels is 6' },
        { key: 'B', text: 'Car().wheels raises AttributeError' },
        { key: 'C', text: 'Car().describe() runs without error' },
        { key: 'D', text: 'Truck().describe() returns "6 wheels"' },
      ],
    },
    answer: { correct: ['A', 'B', 'D'] },
    explanation: "Truck calls `super().__init__(6)` → wheels=6 (A✓, D✓). Car sets only `brand`, so `Car().wheels` → AttributeError (B✓), which also makes `Car().describe()` raise → C ✗.",
  },
  {
    id: 'pred-j87', source: 'predicted', part: 1, seq: 191, topic: 'OOP · dynamic dispatch', points: 1,
    type: 'numeric', examOdds: 50,
    stem: "Given `class P: def go(self): return self.speed(); def speed(self): return 10` and `class Q(P): def speed(self): return 20`. What does `P().go()` return?",
    code: null, payload: { placeholder: 'e.g. 10', decimals: 0 },
    answer: { value: 10, tolerance: 0.001 },
    explanation: "`P().go()` → `self.speed()` on a P → **10**.",
  },
  {
    id: 'pred-j89', source: 'predicted', part: 2, seq: 192, topic: 'OOP · dynamic dispatch', points: 2,
    type: 'numeric', examOdds: 52,
    stem: "With `class P: def go(self): return self.speed(); def speed(self): return 10`, `class Q(P): def speed(self): return 20`, `class R(Q): def go(self): return super().go() * 2`. What does `R().go()` return?",
    code: null, payload: { placeholder: 'e.g. 40', decimals: 0 },
    answer: { value: 40, tolerance: 0.001 },
    explanation: "R.go → super().go() = P.go → self.speed() with self an R → Q.speed = 20 → ×2 = **40**.",
  },
  {
    id: 'pred-j90', source: 'predicted', part: 1, seq: 193, topic: 'OOP · method resolution', points: 2,
    type: 'multiselect', examOdds: 49,
    stem: "For the same P/Q/R classes, which is/are **CORRECT**?",
    code: null,
    payload: {
      options: [
        { key: 'A', text: "Q inherits go from P but go calls Q's speed" },
        { key: 'B', text: 'R.go calls P.go via the MRO, which then calls Q.speed' },
        { key: 'C', text: "Method resolution happens at runtime on the instance's actual class" },
        { key: 'D', text: 'R must redefine speed for R().go() to work' },
      ],
    },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — R inherits `speed` from Q.",
  },
  {
    id: 'pred-j86', source: 'predicted', part: 2, seq: 194, topic: 'OOP · vocabulary', points: 3,
    type: 'matching', examOdds: 47,
    stem: "Match each term to its meaning.",
    code: null,
    payload: {
      left: [
        { id: 'comp', text: 'composition' },
        { id: 'inh', text: 'inheritance' },
        { id: 'mangle', text: 'self.__x' },
        { id: 'override', text: 'subclass redefines a parent method' },
        { id: 'dispatch', text: "self.f1() resolving to the subclass's version" },
      ],
      options: ['"is-a"', '"has-a"', 'overriding', 'name mangling', 'dynamic dispatch'],
    },
    answer: { comp: '"has-a"', inh: '"is-a"', mangle: 'name mangling', override: 'overriding', dispatch: 'dynamic dispatch' },
    explanation: "composition = has-a; inheritance = is-a; `self.__x` = name mangling; redefining = overriding; runtime resolution = dynamic dispatch.",
  },

  // ───────────────────────── FROM THE FULL MOCK (SET K) ─────────────────────────
  {
    id: 'pred-k4', source: 'predicted', part: 1, seq: 200, topic: 'Recursion · trace', points: 3,
    type: 'numeric', examOdds: 56,
    stem: "Trace and give the printed output:",
    code:
`def mystery(n, acc=1):
    if n <= 1: return acc
    return mystery(n-1, acc*n)
print(mystery(5))`,
    payload: { placeholder: 'e.g. 120', decimals: 0 },
    answer: { value: 120, tolerance: 0.001 },
    explanation: "Accumulator-style factorial: mystery(5) = 5! = **120**.",
  },
  {
    id: 'pred-k2', source: 'predicted', part: 2, seq: 201, topic: 'Heaps · build_max_heap', points: 3,
    type: 'dropdowns', examOdds: 64,
    stem: "Run `build_max_heap([3, 9, 2, 11, 4, 7])`. Give the resulting array and the number of `max_heapify` calls made by `build_max_heap`.",
    code: null,
    payload: {
      blanks: [
        { id: 'a0', label: 'array[0]', options: ['3', '9', '2', '11', '4', '7'] },
        { id: 'a1', label: 'array[1]', options: ['3', '9', '2', '11', '4', '7'] },
        { id: 'a2', label: 'array[2]', options: ['3', '9', '2', '11', '4', '7'] },
        { id: 'a3', label: 'array[3]', options: ['3', '9', '2', '11', '4', '7'] },
        { id: 'a4', label: 'array[4]', options: ['3', '9', '2', '11', '4', '7'] },
        { id: 'a5', label: 'array[5]', options: ['3', '9', '2', '11', '4', '7'] },
        { id: 'calls', label: '# calls', options: ['1', '2', '3', '4'] },
      ],
    },
    answer: { a0: '11', a1: '9', a2: '7', a3: '3', a4: '4', a5: '2', calls: '3' },
    explanation: "n=6, start idx 2, i=2,1,0 → 3 calls. i=2: 2↔7. i=1: 9↔11. i=0: 3↔11 then recurse 3↔9 → **[11,9,7,3,4,2]**, **3 calls**.",
  },
  {
    id: 'pred-k7', source: 'predicted', part: 3, seq: 202, topic: 'Graphs · topological sort', points: 5,
    type: 'ordering', examOdds: 66,
    stem: "Directed graph `A→C, A→D, B→D, C→E, D→E, D→F, E→G, F→G, H→B`. Give the **topological sort** (children alphabetical, sweep remaining nodes alphabetically). Order all 8 nodes A–H.",
    code: null,
    payload: {
      items: [
        { id: 'A', text: 'A' }, { id: 'B', text: 'B' }, { id: 'C', text: 'C' }, { id: 'D', text: 'D' },
        { id: 'E', text: 'E' }, { id: 'F', text: 'F' }, { id: 'G', text: 'G' }, { id: 'H', text: 'H' },
      ],
    },
    answer: { order: ['H', 'B', 'A', 'D', 'F', 'C', 'E', 'G'] },
    explanation: "DFS finish order G,E,C,F,D,A,B,H → reverse → **H,B,A,D,F,C,E,G**. All 9 edges point forward.",
  },
  {
    id: 'pred-k15', source: 'predicted', part: 2, seq: 203, topic: 'Logistic regression · gradient step', points: 3,
    type: 'numeric', examOdds: 62,
    stem: "Logistic regression, α = 0.5, b₀ = 0, b₁ = 0, m = 4, data (x₁,y): (1,0),(2,0),(3,1),(4,1). Compute **b₁** after the first update (4 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.2500', decimals: 4 },
    answer: { value: 0.25, tolerance: 0.0005 },
    explanation: "b=0 ⇒ p=0.5 all. Σx₁(p−y) = 1(0.5)+2(0.5)+3(−0.5)+4(−0.5) = −2.0. α/m = 0.125. b₁ = 0 − 0.125(−2.0) = **0.2500**.",
  },

  // ───────────────────────── EXTRA POOL (to grow the grind to 100+) ─────────────────────────
  {
    id: 'pred-a2', source: 'predicted', part: 1, seq: 210, topic: 'Linear regression · prediction', points: 1,
    type: 'numeric', examOdds: 70, stem: "Model `ŷ = 3x − 2`. What is `ŷ(5)`?",
    code: null, payload: { placeholder: 'e.g. 13', decimals: 0 }, answer: { value: 13, tolerance: 0.001 },
    explanation: "ŷ(5) = 3(5) − 2 = **13**.",
  },
  {
    id: 'pred-a4', source: 'predicted', part: 1, seq: 211, topic: 'Linear regression · mean', points: 1,
    type: 'numeric', examOdds: 60, stem: "Actual y values are `[2, 5, 6, 12]`. Compute `ȳ` (the mean).",
    code: null, payload: { placeholder: 'e.g. 6.25', decimals: 2 }, answer: { value: 6.25, tolerance: 0.01 },
    explanation: "(2+5+6+12)/4 = **6.25**.",
  },
  {
    id: 'pred-a5', source: 'predicted', part: 2, seq: 212, topic: 'Linear regression · SS_tot', points: 2,
    type: 'numeric', examOdds: 58, stem: "Actual y = `[2, 5, 6, 12]`, ȳ = 6.25. Compute `SS_tot = Σ(y − ȳ)²`.",
    code: null, payload: { placeholder: 'e.g. 52.75', decimals: 2 }, answer: { value: 52.75, tolerance: 0.05 },
    explanation: "18.0625 + 1.5625 + 0.0625 + 33.0625 = **52.75**.",
  },
  {
    id: 'pred-a8', source: 'predicted', part: 1, seq: 213, topic: 'Multiple linear regression', points: 2,
    type: 'numeric', examOdds: 62, stem: "Model `ŷ = 1 + 2x₁ − 3x₂`. Predict at (x₁, x₂) = (0, 1).",
    code: null, payload: { placeholder: 'e.g. -2', decimals: 0 }, answer: { value: -2, tolerance: 0.001 },
    explanation: "1 + 0 − 3 = **−2**.",
  },
  {
    id: 'pred-b19', source: 'predicted', part: 2, seq: 214, topic: 'Logistic regression · gradient step', points: 3,
    type: 'numeric', examOdds: 58,
    stem: "Logistic regression, α = 0.1, b₀ = −1, b₁ = 0.5, m = 4, data (x₁,y): (2,0),(4,1),(6,1),(1,0). Compute **b₀** after one update (4 d.p.). *(z = −1 + 0.5x₁.)*",
    code: null, payload: { placeholder: 'e.g. -1.0122', decimals: 4 }, answer: { value: -1.0122, tolerance: 0.0008 },
    explanation: "p = [0.5, 0.7311, 0.8808, 0.3775]; p−y = [0.5, −0.2689, −0.1192, 0.3775], Σ = 0.4894. α/m = 0.025. b₀ = −1 − 0.025(0.4894) = **−1.0122**.",
  },
  {
    id: 'pred-b20', source: 'predicted', part: 2, seq: 215, topic: 'Logistic regression · gradient step', points: 3,
    type: 'numeric', examOdds: 58,
    stem: "Same setup (α = 0.1, b₀ = −1, b₁ = 0.5, m = 4; (2,0),(4,1),(6,1),(1,0)). Compute **b₁** after one update (4 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.5103', decimals: 4 }, answer: { value: 0.5103, tolerance: 0.0008 },
    explanation: "Σx₁(p−y) = 2(0.5)+4(−0.2689)+6(−0.1192)+1(0.3775) = −0.4134. b₁ = 0.5 − 0.025(−0.4134) = **0.5103**.",
  },
  {
    id: 'pred-c22', source: 'predicted', part: 1, seq: 216, topic: 'Confusion matrix · sensitivity', points: 2,
    type: 'numeric', examOdds: 62, stem: "2×2 matrix: TP=45, FN=5, FP=10, TN=40. Compute **sensitivity (recall)** (2 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.90', decimals: 2 }, answer: { value: 0.90, tolerance: 0.011 },
    explanation: "Sensitivity = TP/(TP+FN) = 45/50 = **0.90**.",
  },
  {
    id: 'pred-c23', source: 'predicted', part: 1, seq: 217, topic: 'Confusion matrix · specificity', points: 2,
    type: 'numeric', examOdds: 60, stem: "Same matrix (TP=45, FN=5, FP=10, TN=40). Compute **specificity** (2 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.80', decimals: 2 }, answer: { value: 0.80, tolerance: 0.011 },
    explanation: "Specificity = TN/(TN+FP) = 40/50 = **0.80**.",
  },
  {
    id: 'pred-c27', source: 'predicted', part: 2, seq: 218, topic: 'Confusion matrix · sensitivity (multi-class)', points: 2,
    type: 'numeric', examOdds: 58,
    stem: "3-class matrix (rows actual, cols predicted; X,Y,Z):\n\n```\n     X   Y   Z\nX   30   4   6\nY    5  25  10\nZ    2   3  15\n```\nCompute the **sensitivity of class Z** (4 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.7500', decimals: 4 }, answer: { value: 0.75, tolerance: 0.0005 },
    explanation: "Sensitivity = diagonal ÷ ROW sum = 15/(2+3+15) = 15/20 = **0.7500**.",
  },
  {
    id: 'pred-d29', source: 'predicted', part: 1, seq: 219, topic: 'Pandas · shape', points: 2,
    type: 'text', examOdds: 55,
    stem: "DataFrame `df` has 4 rows and columns `name, dept, salary, years`. What does `print(df.shape)` output?",
    code: null, payload: { placeholder: 'type the exact output' }, answer: { accept: ['(4, 4)', '(4,4)'] },
    explanation: "4 data rows × 4 columns → **(4, 4)** (index and header aren't counted).",
  },
  {
    id: 'pred-d31', source: 'predicted', part: 1, seq: 220, topic: 'Pandas · double brackets', points: 2,
    type: 'text', examOdds: 54,
    stem: "What does `print(type(df[['salary']]).__name__)` output?",
    code: null, payload: { placeholder: 'type the exact output' }, answer: { accept: ['dataframe'] },
    explanation: "Double brackets keep it 2-D → **DataFrame** (single brackets would give a Series).",
  },
  {
    id: 'pred-d36', source: 'predicted', part: 2, seq: 221, topic: 'Numpy · prepare_feature', points: 3,
    type: 'multiselect', examOdds: 52, stem: "Which statement(s) about `prepare_feature` is/are **CORRECT**?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'It appends a column of ones as the last column' },
      { key: 'B', text: 'It prepends a column of ones as the first column' },
      { key: 'C', text: 'After it runs, X.shape[1] equals beta.shape[0]' },
      { key: 'D', text: 'It uses np.concatenate((ones, np_feature), axis=1)' },
    ] },
    answer: { correct: ['B', 'C', 'D'] },
    explanation: "B, C, D ✓. A ✗ — the ones column goes **first**, not last.",
  },
  {
    id: 'pred-e44', source: 'predicted', part: 2, seq: 222, topic: 'Numpy · split_data', points: 3,
    type: 'multiselect', examOdds: 52,
    stem: "`split_data(features, target, random_state=100, test_size=0.3)` on a 506-row dataset. Which is/are **CORRECT**?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'It returns 4 arrays: (feature_train, feature_test, target_train, target_test)' },
      { key: 'B', text: 'The test set has 151 rows and the training set has 355' },
      { key: 'C', text: 'random_state seeds np.random.seed so the split is reproducible' },
      { key: 'D', text: 'Test indices are chosen with replace=True so a row can appear twice' },
    ] },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — `replace=False`, so no row repeats.",
  },
  {
    id: 'pred-f48', source: 'predicted', part: 1, seq: 223, topic: 'State machine · transduce', points: 2,
    type: 'multiselect', examOdds: 46,
    stem: "`transduce` checks `is_done()` **before** each step. Which follow(s)?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'The output list can be shorter than the input list' },
      { key: 'B', text: 'Once done(state) is True, no further inputs are processed' },
      { key: 'C', text: 'The output for the step that reaches the terminating state is still included' },
      { key: 'D', text: 'transduce always returns exactly len(inp_list) outputs' },
    ] },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — early termination makes the output shorter.",
  },
  {
    id: 'pred-f51', source: 'predicted', part: 2, seq: 224, topic: 'State machine · trace', points: 3,
    type: 'multiselect', examOdds: 44,
    stem: "`SimpleAccount` with `done(state): return state < 0`, `get_next_values` returns `state+inp−5` if `inp<0 and state<100` else `state+inp`. With `balance = 10` and inputs `[-20, 50, 50]`, which is/are **CORRECT**?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'The first output is −15' },
      { key: 'B', text: 'transduce returns a list of length 1' },
      { key: 'C', text: 'transduce returns a list of length 3' },
      { key: 'D', text: 'The machine stops because done became True' },
    ] },
    answer: { correct: ['A', 'B', 'D'] },
    explanation: "State 10, inp −20 → 10−20−5 = −15 (A ✓). done(−15) is True, so `is_done()` stops the loop next iteration → length 1 (B ✓, D ✓, C ✗).",
  },
  {
    id: 'pred-f52', source: 'predicted', part: 2, seq: 225, topic: 'State machine · CokeMachine', points: 3,
    type: 'dropdowns', examOdds: 46,
    stem: "`CokeMachine`: state 0 = nothing inserted, state 1 = 50¢ inserted. Coke costs 100¢; coins are 50 or 100. Complete the transition from **state 1** on input **100**.",
    code: null,
    payload: { blanks: [
      { id: 'next', label: 'next state', options: ['0', '1'] },
      { id: 'disp', label: 'dispensed', options: ['nothing', 'coke', 'change'] },
      { id: 'change', label: 'change (¢)', options: ['0', '50', '100', '150'] },
    ] },
    answer: { next: '0', disp: 'coke', change: '50' },
    explanation: "State 1 = 50¢ already in. Insert 100 → total 150 ≥ 100 → dispense coke, return 50 change, reset to state 0.",
  },
  {
    id: 'pred-h68', source: 'predicted', part: 1, seq: 226, topic: 'Sorting · optimised bubble', points: 2,
    type: 'numeric', examOdds: 52,
    stem: "Optimised bubble sort (with a `swapped` flag) on `[1, 2, 3, 4, 5]`: how many **passes** does it make?",
    code: null, payload: { placeholder: 'e.g. 1', decimals: 0 }, answer: { value: 1, tolerance: 0.001 },
    explanation: "No swaps occur on pass 1, so the `swapped` flag stays False and it breaks → **1 pass**.",
  },
  {
    id: 'pred-h72', source: 'predicted', part: 2, seq: 227, topic: 'Heaps · build_max_heap', points: 3,
    type: 'dropdowns', examOdds: 60,
    stem: "Run `build_max_heap([1, 12, 9, 5, 6, 10])`. Give the resulting array and the number of `max_heapify` calls made by `build_max_heap`.",
    code: null,
    payload: { blanks: [
      { id: 'a0', label: 'array[0]', options: ['1', '12', '9', '5', '6', '10'] },
      { id: 'a1', label: 'array[1]', options: ['1', '12', '9', '5', '6', '10'] },
      { id: 'a2', label: 'array[2]', options: ['1', '12', '9', '5', '6', '10'] },
      { id: 'a3', label: 'array[3]', options: ['1', '12', '9', '5', '6', '10'] },
      { id: 'a4', label: 'array[4]', options: ['1', '12', '9', '5', '6', '10'] },
      { id: 'a5', label: 'array[5]', options: ['1', '12', '9', '5', '6', '10'] },
      { id: 'calls', label: '# calls', options: ['1', '2', '3', '4'] },
    ] },
    answer: { a0: '12', a1: '6', a2: '10', a3: '5', a4: '1', a5: '9', calls: '3' },
    explanation: "n=6, start idx 2, i = 2,1,0 → 3 calls. Result **[12, 6, 10, 5, 1, 9]**, **3 calls**.",
  },
  {
    id: 'pred-h73', source: 'predicted', part: 3, seq: 228, topic: 'Heaps · build_max_heap', points: 4,
    type: 'dropdowns', examOdds: 58,
    stem: "Run `build_max_heap([2, 8, 5, 1, 9, 3, 7, 4])`. Give the resulting array and the call count.",
    code: null,
    payload: { blanks: [
      { id: 'a0', label: 'array[0]', options: ['2', '8', '5', '1', '9', '3', '7', '4'] },
      { id: 'a1', label: 'array[1]', options: ['2', '8', '5', '1', '9', '3', '7', '4'] },
      { id: 'a2', label: 'array[2]', options: ['2', '8', '5', '1', '9', '3', '7', '4'] },
      { id: 'a3', label: 'array[3]', options: ['2', '8', '5', '1', '9', '3', '7', '4'] },
      { id: 'a4', label: 'array[4]', options: ['2', '8', '5', '1', '9', '3', '7', '4'] },
      { id: 'a5', label: 'array[5]', options: ['2', '8', '5', '1', '9', '3', '7', '4'] },
      { id: 'a6', label: 'array[6]', options: ['2', '8', '5', '1', '9', '3', '7', '4'] },
      { id: 'a7', label: 'array[7]', options: ['2', '8', '5', '1', '9', '3', '7', '4'] },
      { id: 'calls', label: '# calls', options: ['3', '4', '5'] },
    ] },
    answer: { a0: '9', a1: '8', a2: '7', a3: '4', a4: '2', a5: '3', a6: '5', a7: '1', calls: '4' },
    explanation: "n=8, start idx 3, i = 3,2,1,0 → 4 calls. Result **[9, 8, 7, 4, 2, 3, 5, 1]**, **4 calls**.",
  },
  {
    id: 'pred-i78', source: 'predicted', part: 2, seq: 229, topic: 'Graphs · DFS', points: 3,
    type: 'ordering', examOdds: 52,
    stem: "Directed graph `A→B, A→C, B→D, B→E, C→F, E→F, F→G`. Give the **DFS traversal (visit/pre-order)** from A, exploring neighbours alphabetically.",
    code: null,
    payload: { items: [
      { id: 'A', text: 'A' }, { id: 'B', text: 'B' }, { id: 'C', text: 'C' },
      { id: 'D', text: 'D' }, { id: 'E', text: 'E' }, { id: 'F', text: 'F' }, { id: 'G', text: 'G' },
    ] },
    answer: { order: ['A', 'B', 'D', 'E', 'F', 'G', 'C'] },
    explanation: "Go deep first: A→B→D (dead end), back to B→E→F→G, then back up to A→C. Visit order **A, B, D, E, F, G, C**.",
  },
  {
    id: 'pred-i82', source: 'predicted', part: 1, seq: 230, topic: 'Graphs · cycles', points: 2,
    type: 'mcq', examOdds: 48,
    stem: "Take the DAG `A→B, A→C, B→D, B→E, C→F, E→F, F→G` and add the edge `G → A`. Can a topological sort still be produced?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'Yes — topological sort works on any directed graph' },
      { key: 'B', text: 'No — the new edge creates a cycle (A→C→F→G→A)' },
      { key: 'C', text: 'Yes — as long as you start from A' },
      { key: 'D', text: 'No — because G now has two parents' },
    ] },
    answer: { correct: 'B' },
    explanation: "`G→A` closes a cycle `A→C→F→G→A`. Topological sort only exists for a **DAG**; a cycle makes it impossible.",
  },
  {
    id: 'pred-j84', source: 'predicted', part: 1, seq: 231, topic: 'OOP · super()', points: 2,
    type: 'mcq', examOdds: 50,
    stem: "`Vehicle.__init__(self, wheels)` sets `self.wheels`; `Car(Vehicle)` overrides `__init__` to set only `self.brand`, and `describe` calls `super().describe()`. What makes `Car().describe()` work?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'Add super().__init__(4) (or otherwise set self.wheels) in Car.__init__' },
      { key: 'B', text: 'Nothing — it already works' },
      { key: 'C', text: 'Rename describe to __describe__' },
      { key: 'D', text: 'Delete the super().describe() call' },
    ] },
    answer: { correct: 'A' },
    explanation: "`describe` needs `self.wheels`, which `Car.__init__` never sets. Calling `super().__init__(4)` (or assigning `self.wheels`) fixes it.",
  },
  {
    id: 'pred-j85', source: 'predicted', part: 1, seq: 232, topic: 'OOP · @property', points: 2,
    type: 'multiselect', examOdds: 48,
    stem: "Which statement(s) about `@property` is/are **CORRECT**?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'It lets a method be accessed without parentheses' },
      { key: 'B', text: 'A matching @x.setter lets you validate assignment' },
      { key: 'C', text: 'Double leading underscores (self.__items) trigger name mangling' },
      { key: 'D', text: '@property makes an attribute genuinely private and unreachable' },
    ] },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — name mangling is a convention; `obj._ClassName__items` still reaches it.",
  },
  {
    id: 'pred-k3', source: 'predicted', part: 1, seq: 233, topic: 'Sorting · merge sort', points: 2,
    type: 'multiselect', examOdds: 52,
    stem: "Which statement(s) about **merge sort** is/are **CORRECT**?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'It is a divide-and-conquer algorithm' },
      { key: 'B', text: 'Its time complexity is O(n log n) in the best, average and worst case' },
      { key: 'C', text: 'It sorts in place with O(1) extra space' },
      { key: 'D', text: 'The merge step compares the front elements of the two sorted halves' },
    ] },
    answer: { correct: ['A', 'B', 'D'] },
    explanation: "A, B, D ✓. C ✗ — merge sort needs O(n) auxiliary space, so it is not in-place.",
  },
  {
    id: 'pred-k5', source: 'predicted', part: 1, seq: 234, topic: 'OOP · abstract base classes', points: 2,
    type: 'multiselect', examOdds: 52,
    stem: "Given `Shape(abc.ABC)` with abstract `area` and `name`; `Square(Shape)` implements `area` only; `NamedSquare(Square)` implements `name`. Which do/does **NOT** raise an error?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'Shape()' },
      { key: 'B', text: 'Square(4)' },
      { key: 'C', text: 'NamedSquare(4).area()' },
      { key: 'D', text: 'NamedSquare(4).name()' },
    ] },
    answer: { correct: ['C', 'D'] },
    explanation: "Shape and Square are still abstract (Square lacks `name`) → both raise. NamedSquare implements both → C and D run fine.",
  },
  {
    id: 'pred-k6', source: 'predicted', part: 2, seq: 235, topic: 'OOP · inheritance', points: 3,
    type: 'multiselect', examOdds: 54,
    stem: "`Base.__init__` sets `self.x=1`; `Child(Base).__init__` sets only `self.y=2` and `show` calls `super().show()` (which prints `self.x`). Which is/are **CORRECT**?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'The code prints two lines' },
      { key: 'B', text: 'The code raises AttributeError' },
      { key: 'C', text: 'Child() has attribute y but not x' },
      { key: 'D', text: 'Adding super().__init__() to Child.__init__ fixes it' },
    ] },
    answer: { correct: ['B', 'C', 'D'] },
    explanation: "`Child.__init__` never sets x, so `super().show()` raises AttributeError before printing (A ✗, B ✓, C ✓). Calling `super().__init__()` creates x → D ✓.",
  },
  {
    id: 'pred-k11', source: 'predicted', part: 2, seq: 236, topic: 'Numpy · gradient shape', points: 3,
    type: 'multiselect', examOdds: 54,
    stem: "`error = calc_linreg(X, beta) - y` has shape `(m,1)`; `beta` is `(n+1,1)`. Which expression(s) give a correctly-shaped gradient?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'np.matmul(X.T, error)' },
      { key: 'B', text: 'np.matmul(X, error)' },
      { key: 'C', text: 'X.T @ error' },
      { key: 'D', text: 'np.sum(X * error)' },
    ] },
    answer: { correct: ['A', 'C'] },
    explanation: "`X.T` is (n+1, m), `error` is (m, 1) → (n+1, 1) ✓ (A and C, `@` = `np.matmul`). B has incompatible shapes; D collapses to a scalar.",
  },
  {
    id: 'pred-k12', source: 'predicted', part: 1, seq: 237, topic: 'Data visualisation', points: 2,
    type: 'multiselect', examOdds: 50,
    stem: "Which is/are **CORRECT** about visualising the Boston housing dataset?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'sns.histplot(data=df, x="MEDV", bins=5) groups MEDV into 5 intervals' },
      { key: 'B', text: 'sns.boxplot(data=df, x="MEDV") reveals outliers' },
      { key: 'C', text: 'sns.scatterplot(x="RM", y="MEDV", data=df) shows whether the two are related' },
      { key: 'D', text: 'A histogram is the right plot for the categorical column CHAS' },
    ] },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — CHAS is a binary categorical flag; use a countplot.",
  },
  {
    id: 'pred-k13', source: 'predicted', part: 1, seq: 238, topic: 'Linear regression metrics', points: 2,
    type: 'multiselect', examOdds: 54,
    stem: "**Which statement(s) about linear regression metrics is/are INCORRECT?**",
    code: null,
    payload: { options: [
      { key: 'A', text: 'A negative R² means the model is worse than always predicting ȳ' },
      { key: 'B', text: 'A model with MSE = 0 has R² = 0' },
      { key: 'C', text: 'R² has no units; MSE has squared target units' },
      { key: 'D', text: 'MSE below 1 always indicates a good model' },
    ] },
    answer: { correct: ['B', 'D'] },
    explanation: "B and D are the incorrect ones. MSE = 0 means perfect predictions → R² = **1**, not 0. And MSE is scale-dependent, so 'below 1' is meaningless.",
  },
  {
    id: 'pred-k14', source: 'predicted', part: 1, seq: 239, topic: 'Multiple linear regression', points: 2,
    type: 'multiselect', examOdds: 52,
    stem: "Which statement(s) about multiple linear regression is/are **CORRECT**?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'beta has n_features + 1 rows' },
      { key: 'B', text: 'Features must be on identical scales or the model cannot produce any prediction at all' },
      { key: 'C', text: 'All features should be normalised with the training statistics before gradient descent' },
      { key: 'D', text: 'prepare_feature must be applied after normalisation' },
    ] },
    answer: { correct: ['A', 'C', 'D'] },
    explanation: "A, C, D ✓. B ✗ — an unnormalised model still predicts fine; normalisation is about making gradient descent *converge*.",
  },
  {
    id: 'pred-g65', source: 'predicted', part: 1, seq: 240, topic: 'Concept · BFS and DFS', points: 2,
    type: 'multiselect', examOdds: 50,
    stem: "Which statement(s) about BFS and DFS is/are **CORRECT**?",
    code: null,
    payload: { options: [
      { key: 'A', text: 'BFS uses a queue (FIFO); DFS uses a stack (LIFO) or recursion' },
      { key: 'B', text: 'BFS finds the shortest path in an unweighted graph' },
      { key: 'C', text: 'Topological sort is the reverse of DFS finishing order' },
      { key: 'D', text: 'DFS always visits fewer nodes than BFS' },
    ] },
    answer: { correct: ['A', 'B', 'C'] },
    explanation: "A, B, C ✓. D ✗ — both traversals visit every reachable node.",
  },
  {
    id: 'pred-k20', source: 'predicted', part: 2, seq: 241, topic: 'Linear regression · MSE', points: 2,
    type: 'numeric', examOdds: 60,
    stem: "Model `ŷ = −0.5x + 4`. Test set (2,3),(4,1),(6,2) → predictions 3, 2, 1. Compute the **MSE** (2 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.67', decimals: 2 }, answer: { value: 0.67, tolerance: 0.02 },
    explanation: "Residuals: 0, −1, 1 → SS_res = 0+1+1 = 2. MSE = 2/3 = **0.67**.",
  },
  {
    id: 'pred-k21', source: 'predicted', part: 3, seq: 242, topic: 'Linear regression · R²', points: 2,
    type: 'numeric', examOdds: 58,
    stem: "Same setup (ŷ = 3,2,1; actual y = 3,1,2). Compute **R²** (2 d.p.).",
    code: null, payload: { placeholder: 'e.g. 0.00', decimals: 2 }, answer: { value: 0.0, tolerance: 0.011 },
    explanation: "ȳ = 2. SS_tot = 1+1+0 = 2, SS_res = 2. R² = 1 − 2/2 = **0.00** — exactly as good as predicting the mean.",
  },
];
