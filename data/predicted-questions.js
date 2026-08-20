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
];
