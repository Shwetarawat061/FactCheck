# Requirements Document

## Introduction

FactCheckAI is an evidence-first claim verification product with a React + TypeScript frontend and a Flask backend. Today it retrieves web sources, asks Gemini to judge those sources, validates citation excerpts against retrieved text, and applies conservative domain-diversity gates. Confidence is a fixed heuristic. The backend does not train, evaluate, or serve a machine-learning model.

This feature upgrades the existing repository into an Evidence Intelligence Engine (FactCheckAI 2.0). The system shall independently analyze claims and retrieved evidence with trained and pretrained ML/NLP models, then use Gemini only to explain the gated result. Gemini shall not override ML or evidence gates. Insufficient evidence or model disagreement shall produce `INCONCLUSIVE`.

Work shall stay in the existing application on feature branches. Large datasets and model weights shall not be committed to Git. Evaluation numbers shall come from executed experiments, not estimates. The first delivery milestone is FEVER-based classical ML baselines plus Flask integration of the best model. Later milestones add pretrained NLI, semantic ranking, calibrated confidence, an ML Insights dashboard, and professional ML engineering.

Existing user-facing verdicts (`TRUE`, `MOSTLY TRUE`, `MIXED`, `MOSTLY FALSE`, `FALSE`, `INCONCLUSIVE`) shall remain valid unless a later approved change maps them.

## Requirements

### Requirement 1

**User Story:** As a developer, I want a dedicated ML module in the existing repository, so that training, evaluation, and inference stay separate from the working web app.

#### Acceptance Criteria

1. WHEN a contributor opens the repository THEN the system SHALL provide an `ml/` module that can download, preprocess, train, evaluate, and export models without replacing the existing frontend or Flask app.
2. WHEN ML work is implemented THEN the system SHALL keep the existing claim-check UI and API routes operational on a feature branch until that branch is reviewed and merged.
3. IF a dataset file, checkpoint, or embedding cache is larger than typical source code THEN the repository SHALL exclude it from Git and SHALL provide download or load instructions instead.
4. WHERE local setup runs on Windows with VS Code THEN the ML module SHALL include commands that work in PowerShell for environment creation, dataset download, training, and evaluation.

### Requirement 2

**User Story:** As an ML practitioner, I want reproducible FEVER claim-evidence pairs, so that I can train and compare classical text classifiers.

#### Acceptance Criteria

1. WHEN a developer runs the documented dataset setup THEN the system SHALL obtain the FEVER dataset and prepare claim-evidence examples labeled `SUPPORTS`, `REFUTES`, and `NOT ENOUGH INFO`.
2. WHEN FEVER examples are prepared THEN the system SHALL apply documented text preprocessing, including tokenization and stop-word handling, before TF-IDF feature extraction.
3. IF FEVER files are missing or incomplete THEN training and evaluation SHALL fail with an actionable error and SHALL NOT silently invent labeled examples.
4. WHERE FEVER is the primary baseline dataset THEN the system SHALL keep train, validation, and test splits disjoint for reported metrics.

### Requirement 3

**User Story:** As an ML practitioner, I want three TF-IDF classifiers trained and compared on FEVER, so that I can explain a real baseline in interviews.

#### Acceptance Criteria

1. WHEN the Phase 1 training job runs THEN the system SHALL train TF-IDF + Logistic Regression, TF-IDF + Multinomial Naive Bayes, and TF-IDF + Linear SVM on the same preprocessed FEVER splits.
2. WHEN those models are trained THEN the system SHALL tune hyperparameters using the validation split rather than the test split.
3. WHEN evaluation completes THEN the system SHALL report accuracy, macro F1, per-class precision, per-class recall, and a confusion matrix for each algorithm using actual test-set predictions.
4. IF two models have similar scores THEN the system SHALL still select a single production baseline using a documented rule (for example highest macro F1, with a stated tie-breaker).
5. WHERE documentation or UI shows these results THEN the values SHALL be taken from executed evaluation output and SHALL NOT be estimated.

### Requirement 4

**User Story:** As a backend engineer, I want the best FEVER baseline served from Flask, so that live checks can use a trained model rather than Gemini alone.

#### Acceptance Criteria

1. WHEN the selected baseline is exported THEN Flask SHALL load it for inference without requiring the caller to train a model on each request.
2. WHEN Flask receives a claim and one or more evidence texts THEN the baseline model SHALL return a predicted class and class probabilities or decision scores.
3. IF the model artifact is missing at runtime THEN the API SHALL not fabricate an ML prediction and SHALL either skip the ML stage with an explicit status or return a controlled error that does not crash the process.
4. WHERE Phase 1 is complete THEN Gemini SHALL still be allowed to generate explanations, but the baseline prediction SHALL be available to the verification pipeline independently of Gemini.

### Requirement 5

**User Story:** As a fact-check user, I want retrieved evidence classified as supporting, contradicting, or insufficient, so that the verdict reflects evidence relationships rather than an unconstrained LLM guess.

#### Acceptance Criteria

1. WHEN a claim and a retrieved evidence passage are scored by the NLI capability THEN the system SHALL assign one of `SUPPORTS`, `CONTRADICTS`, or `NEUTRAL` (insufficient / not enough information).
2. WHEN FEVER-style labels are mapped into the product THEN `REFUTES` SHALL map to `CONTRADICTS` and `NOT ENOUGH INFO` SHALL map to `NEUTRAL`.
3. IF the NLI model is a pretrained MNLI/NLI transformer that was not trained in this repository THEN documentation and UI SHALL label it as pretrained and SHALL NOT claim that the team trained that transformer.
4. WHERE both a user-trained baseline and a pretrained NLI model exist THEN the system SHALL keep their predictions distinguishable in API responses and in ML Insights.

### Requirement 6

**User Story:** As a verification engineer, I want semantic ranking of Tavily results, so that duplicate or weakly related passages do not dominate the evidence set.

#### Acceptance Criteria

1. WHEN search results are retrieved THEN the system SHALL compute embedding-based similarity between the claim and each evidence passage.
2. WHEN multiple passages are available THEN the system SHALL rank them by semantic relevance before aggregation.
3. IF two passages exceed a documented similarity threshold THEN the system SHALL treat them as near-duplicates and SHALL not count them as independent decisive evidence solely because the wording differs.
4. WHERE Tavily retrieval fails or returns fewer than two independent domains THEN existing conservative retrieval behavior SHALL still produce `INCONCLUSIVE` rather than an unconstrained model verdict.

### Requirement 7

**User Story:** As a skeptical reviewer, I want calibrated confidence from evidence features, so that a percentage reflects model uncertainty rather than a fixed source-count heuristic.

#### Acceptance Criteria

1. WHEN confidence is computed after the ML confidence capability is enabled THEN the system SHALL use features that include independent domain count, evidence relevance, NLI or baseline class probabilities, source agreement, contradiction ratio, and evidence coverage.
2. WHEN that confidence model or calibrator is evaluated THEN the system SHALL report calibration quality on held-out validation data using actual measured results.
3. IF evidence is insufficient, dropped-excerpt ratio exceeds the existing reliability limit, or supporting and contradicting signals conflict beyond the documented aggregation rule THEN the system SHALL return `INCONCLUSIVE` and SHALL set confidence to a documented non-assertive value.
4. WHERE the ML confidence capability is not yet trained THEN the existing heuristic MAY remain, but the API and UI SHALL not present that heuristic as a calibrated probability.

### Requirement 8

**User Story:** As a product owner, I want Gemini to explain gated ML results, so that users get readable reasoning without the LLM overriding evidence.

#### Acceptance Criteria

1. WHEN ML and evidence gates produce a verdict THEN Gemini SHALL generate summary, analysis, reasoning steps, and citations grounded in retrieved source text.
2. IF Gemini proposes a verdict that conflicts with the gated ML/evidence verdict THEN the system SHALL keep the gated verdict and SHALL not let Gemini replace it.
3. IF Gemini is unavailable THEN the system SHALL still return the gated ML/evidence result when gates can be applied, or `INCONCLUSIVE` when they cannot, and SHALL NOT invent citations.
4. WHERE a citation excerpt is returned THEN existing excerpt-validation rules SHALL still require the excerpt to appear in retrieved source text.

### Requirement 9

**User Story:** As a recruiter or technical reviewer, I want an ML Insights view, so that model behavior and evaluation are visible rather than hidden behind an API.

#### Acceptance Criteria

1. WHEN a fact-check result includes ML output THEN the frontend SHALL display predicted class, prediction scores, supporting versus contradicting evidence, and a confidence breakdown.
2. WHEN evaluation artifacts exist THEN ML Insights SHALL display the measured model comparison table, confusion matrix, and evaluation metrics from those artifacts.
3. IF similarity scores are computed THEN the UI SHALL show them on evidence items.
4. WHERE a model is pretrained rather than trained in this project THEN ML Insights SHALL state that distinction.

### Requirement 10

**User Story:** As a researcher, I want LIAR and SciFact supported as additional evaluation datasets, so that experiments are not limited to a single corpus.

#### Acceptance Criteria

1. WHEN FEVER baseline work is in place THEN the ML module SHALL document LIAR as the high-priority dataset for claim-only classification experiments.
2. WHEN scientific claim evaluation is added THEN the ML module SHALL document SciFact as the high-priority scientific verification dataset.
3. IF a dataset is not downloaded THEN related optional experiments SHALL be skipped with an explicit notice and SHALL NOT block the FEVER baseline path.
4. WHERE metrics are reported per dataset THEN the system SHALL not mix test examples across datasets in a single unlabeled score.

### Requirement 11

**User Story:** As a user, I want conservative auditable verdicts, so that weak or conflicting evidence cannot be presented as a confident TRUE or FALSE.

#### Acceptance Criteria

1. WHEN independent-domain, excerpt-validation, or decisive-evidence gates fail THEN the system SHALL return `INCONCLUSIVE`.
2. WHEN trained or pretrained models disagree with each other or with validated evidence beyond the documented aggregation rule THEN the system SHALL return `INCONCLUSIVE`.
3. IF only one independent domain supplies decisive evidence THEN the system SHALL NOT emit a confident TRUE or FALSE verdict.
4. WHILE the verification pipeline runs THEN existing domain-diversity and excerpt-matching protections SHALL remain in force.

### Requirement 12

**User Story:** As an engineer, I want tests, versioning, and documentation for the ML path, so that experiments are repeatable and the demo is trustworthy.

#### Acceptance Criteria

1. WHEN ML inference or aggregation logic is added THEN automated tests SHALL cover mapping of labels, gate non-override of Gemini, insufficient-evidence `INCONCLUSIVE` behavior, and missing-artifact handling.
2. WHEN a production model is exported THEN the system SHALL record a model version identifier with the evaluation artifact used to select it.
3. WHEN experiment tracking is introduced THEN each reported comparison SHALL be recoverable from stored metrics rather than from chat history.
4. WHERE the project README describes ML capabilities THEN it SHALL only claim models, datasets, and metrics that exist and have been measured.

### Requirement 13

**User Story:** As a developer, I want non-functional quality limits, so that the ML upgrade stays usable in local and demo environments.

#### Acceptance Criteria

1. WHEN Phase 1 training runs on a developer machine THEN the documented default FEVER subset or feature settings SHALL complete without requiring an undocumented GPU.
2. WHEN Flask serves the selected baseline THEN a single claim-evidence inference SHALL complete within a documented latency budget for local development, and measured latency SHALL be recorded in evaluation output.
3. IF adding transformers would make the default demo inoperable on the target machine THEN the pretrained NLI path SHALL be optional at runtime and SHALL degrade to the classical baseline plus `INCONCLUSIVE` when the transformer is unavailable.
4. WHERE secrets are required for Tavily or Gemini THEN the ML module SHALL not require those secrets for offline training and evaluation on local datasets.
