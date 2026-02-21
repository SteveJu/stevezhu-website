# Career Summary — Zhengqi Zhu

*Prepared for EP Law Firm — NIW Petition*

---

## I. Education

- **Master of Science in Computer Science (Machine Learning Track)**, Columbia University, New York, NY (Sep 2023 – May 2025)
- **Artificial Intelligence Graduate Program (Non-degree Option)**, Stanford University, Stanford, CA (Sep 2021 – Mar 2023)
- **Bachelor of Science in Computer Science and Engineering (Artificial Intelligence)**, The Ohio State University, Columbus, OH (Aug 2016 – May 2021)

Mr. Zhu holds advanced degrees from two of the most prestigious computer science programs in the United States — Columbia University and Stanford University — with a specialized focus on Machine Learning and Artificial Intelligence. His academic training has provided him with deep expertise in the theoretical foundations and practical applications of AI/ML, which he directly applies to solving critical problems at scale.

Mr. Zhu graduated from Columbia University with a **GPA of 4.05/4.0** (including A+ grades), and from Stanford University with a **GPA of 3.7/4.0**, demonstrating consistently strong academic performance at two of the most rigorous computer science programs in the nation.

---

## II. Professional Experience

### A. Meta Platforms, Inc. — Software Engineer
**Mar 2025 – Present | New York, NY**

At Meta, one of the world's largest technology companies, Mr. Zhu serves as a Software Engineer contributing to two high-impact areas: (1) Instagram Integrity & Youth Protection, and (2) the Horizon Creator Platform & Monetization ecosystem.

#### Project 1: LLM-Powered Detection of Harmful Anonymous Accounts (Instagram Integrity & Youth Protection)

Mr. Zhu designed and built scalable data pipelines in Python leveraging state-of-the-art Large Language Models — including Meta's Llama and Google's Gemini — to automatically identify and label high-risk anonymous accounts on Instagram. These accounts are typically associated with schools and distribute harmful content targeting minors, including bullying, harassment, non-consensual images, and violent content.

**Technical Contribution:**
- Architected an end-to-end LLM-based data pipeline capable of ingesting account signals, analyzing behavioral and content patterns, and producing high-confidence risk classifications at scale
- Leveraged both Meta's proprietary Llama models and external LLMs (Gemini) for multi-model ensemble detection, improving robustness and reducing false negatives
- Built the system to operate with minimal human intervention, significantly reducing reliance on outsourced manual labeling and review
- The RB (Research-Based) Classifier pipeline scores approximately **108 million accounts daily** across the entire target universe, processing them through a multi-stage architecture: universe pre-scoring → Fluent2 ML model multi-label content classification → post-processing (7-day rolling average + calibration) → final risk flagging at configurable precision thresholds (P70=0.76, P80=0.8, P90=0.9)
- Defined and maintained the target universe with two tiers: (1) Original scope — accounts with 3–10K followers, ≥60% teen follower ratio, active within 30 days, across US/GB/CA/IN/NZ/AU; (2) Expanded scope — accounts with media teen VPVs + search impressions ≥10 and ≥10% teen audience share
- Designed a stratified sampling framework for human labeling (ICC-controlled), replacing fixed-quota manual review with intelligent budget allocation: 58% model positives, 30% introverted accounts, 10% other, 2% heuristic positives, with 20% test set holdout — significantly reducing labeling costs while maintaining model quality
- Built an LLM-assisted calibration system using **Meta's Llama 3 70B Instruct** model, processing **25,000 accounts daily** (sampled from an initial pool of 100,000). The LLM currently serves as a calibration tie-breaker when human labelers disagree, resolving annotation conflicts and generating final classification labels
- Currently leading the development of a **Gemini-based LLM pipeline to fully replace human labeling** — transitioning the system from LLM-as-calibration to LLM-as-primary-annotator, which is projected to eliminate the need for outsourced human review entirely while maintaining or exceeding labeling accuracy

**Impact:**
- **Child & Adolescent Safety**: Directly protects minors from cyberbullying, harassment, and non-consensual content distribution on one of the world's largest social media platforms. This work addresses a critical national concern reflected in U.S. Congressional hearings, proposed legislation (Kids Online Safety Act, COPPA 2.0), and the Surgeon General's advisory on social media and youth mental health.
- **Cost Reduction**: The traditional human labeling pipeline costs approximately **$12,000–$18,000 per day** (~1,200 IGPR reviews + 20,000 stratified sampling labels at $0.57–$0.84/label). Mr. Zhu is currently building a Gemini-based LLM pipeline to **fully replace human labeling**, projected to reduce labeling costs by **80–99%** — from $12K–$18K/day down to $120–$3K/day. This is consistent with comparable Meta-internal projects: the IG PAE Relevance Model achieved ~99% cost reduction ($3K/day → $50/day for 95K labels), and the IG Creator Classifier saved ~$5M over 6 months (9M labels)
- **Detection Effectiveness**: The system has identified approximately **100,000 Problematic Anonymous Accounts** in the United States alone, including ~55,000 violating PAAs (with both subject element and content violations), ~30,000–35,000 accounts posting violating content without subject elements, and ~10,000–15,000 implicit content PAAs. The pipeline classifies ~108M accounts daily with configurable precision thresholds (P70/P80/P90), enabling enforcement at different confidence levels
- **Enforcement at Scale**: The system drives automated enforcement actions processing up to **9,900 accounts per day** via RICE (automated disabling), plus up to 1,200 accounts/day routed to human review (IGPR). An initial one-time enforcement sweep removed **8,000 accounts at 99% precision**
- **Scale**: Instagram serves over 2 billion monthly active users globally; the PAA system's ability to score 108M accounts daily across multiple countries (US, GB, CA, IN, NZ, AU) means improvements to integrity systems have an outsized impact on global child safety

#### Project 2: Instagram Comment Integrity System

Mr. Zhu owns and manages the integrity infrastructure for Instagram's entire comment ecosystem — spanning Feed, Stories, and Reels — ensuring that billions of daily interactions are safe, policy-compliant, and age-appropriate.

**Technical Contribution:**
- Designed and built an Instagram comment filtering system to control content visibility and reduce exposure to bullying, harassment, and other policy-violating content
- Maintained and optimized integrity signals across all comment surfaces, improving safety signal quality and enforcement effectiveness
- Implemented differentiated content policies by age group: minors are fully shielded from violating content, while adults receive downranked visibility of borderline content
- Cleaned up and refactored legacy signal infrastructure to improve system reliability and reduce false positives
- Partnered closely with policy, privacy, and product teams to translate evolving safety requirements into robust, scalable technical solutions

**Impact:**
- **User Protection at Scale**: Safeguards comment interactions across all Instagram surfaces for over 2 billion users
- **Minor Safety**: Ensures age-appropriate content enforcement, directly protecting millions of minor users on the platform

#### Additional Meta Contributions: Horizon Creator Platform & Monetization

Prior to his current role on Instagram Integrity, Mr. Zhu contributed to Meta's Horizon Creator Platform, building core capabilities for digital asset creation, monetization, and integrity enforcement in Meta's metaverse ecosystem.

- Built core capabilities for the Meta Horizon Creator Portal, enabling creators to generate, list, and monetize digital assets using Generative AI
- Designed and launched end-to-end publishing and monetization workflows with cross-surface support across Horizon, Facebook, and Instagram, increasing creator engagement and marketplace growth
- Architected scalable systems for content moderation of user-generated avatar items, including a modular enforcement framework and creator strike pipeline
- Designed a digital item tiering system with real-time calculation, differentiated UI, and automated migration logic
- Led product expansion into international markets by implementing region-specific compliance logic, partnering with privacy, legal, policy, and infrastructure teams
- Contributed to the Meta Horizon Studio desktop application by porting Creator Portal capabilities into a native 3D editing experience

---

### B. Bank of America — Software Engineer
**Jul 2021 – Mar 2025 (~3.5 years) | Jersey City, NJ**

At Bank of America, one of the largest financial institutions in the United States, Mr. Zhu developed enterprise-grade software systems supporting critical banking operations.

- Developed cloud-based data visualization platforms using Java, Spring Boot, Maven, and JBoss
- Implemented 200+ production features across enterprise systems using Java, JavaScript, SQL, and HTML
- Led a critical framework upgrade across thousands of files under tight timelines, significantly improving system stability and maintainability
- Built internal tooling and Python-based utilities to support platform reliability and technology lifecycle management

**Impact:**
- Delivered 200+ production features supporting critical banking infrastructure
- Led enterprise-wide framework modernization, directly improving the stability and security of financial technology systems serving millions of customers

---

### C. Research Assistant — The Ohio State University
**Jan 2020 – May 2021 | Columbus, OH**

- Conducted applied research across aviation, agriculture, and cognitive science domains, developing computer vision and data analysis pipelines using Python and OpenCV
- Built end-to-end data collection and visualization tools, including mobile and web-based applications, to support real-world experimentation
- Collaborated with cross-disciplinary researchers to translate research requirements into scalable engineering solutions and production-ready prototypes

---

## III. Technical Expertise

- **AI & Machine Learning**: Large Language Models (Llama, Gemini), NLP, computer vision, PyTorch, TensorFlow, ML pipeline architecture
- **Content Integrity & Trust & Safety**: Policy enforcement systems, content moderation at scale, signal engineering, age-gated enforcement
- **Languages**: Python, PHP (Hack), Java, JavaScript, SQL, HTML, C++, C#
- **Infrastructure**: GraphQL, AWS (EC2, RDS, S3), Kafka, Docker, Linux, Git
- **Data**: MySQL, Oracle DB, large-scale data processing
- **Frameworks**: React, Spring Boot, Flask, FastAPI, RESTful APIs

---

## IV. Achievements & Recognition

- **Meta Performance Rating: "Exceeds Expectations"** (2025 annual review cycle) — awarded to employees who consistently deliver impact beyond the expectations of their role

---

## V. Future Plans in the United States

Mr. Zhu intends to continue advancing the field of AI-powered content integrity and online safety in the United States. His planned endeavors include:

1. **Advancing AI-Driven Child Safety Systems**: Continue developing and scaling LLM-based detection systems that protect minors from online harms — an area of critical national importance as the U.S. government, educators, and parents grapple with the impact of social media on youth mental health and safety.

2. **Pioneering Responsible AI for Content Moderation**: Develop more accurate, efficient, and privacy-preserving methods for detecting harmful content at scale, contributing to the U.S.'s leadership in responsible AI development.

3. **Bridging AI Research and Production**: Leverage his unique combination of academic training (Columbia ML, Stanford AI) and industry experience (Meta, Bank of America) to translate cutting-edge AI research into production systems that serve billions of users.

---

## VI. National Importance Argument (For Attorney Reference)

**Why Mr. Zhu's work is in the national interest of the United States:**

1. **Child & Adolescent Online Safety**: Mr. Zhu's work at Meta directly addresses one of the most pressing national concerns in the United States. The U.S. Surgeon General has issued an advisory on social media's impact on youth mental health. Congressional hearings with major tech CEOs, proposed legislation (Kids Online Safety Act, COPPA 2.0), and executive actions all underscore the urgency of protecting minors online. Mr. Zhu builds the technical systems that make this protection possible at scale.

2. **AI Leadership & National Competitiveness**: The development of advanced LLM-based content moderation systems positions the U.S. at the forefront of responsible AI — a strategic priority identified in the National AI Initiative Act and various executive orders on AI safety and innovation.

3. **Economic Contribution**: As a software engineer at Meta, Mr. Zhu contributes to one of America's most valuable technology companies. His work in automating content moderation through AI reduces operational costs while improving effectiveness — a direct contribution to U.S. economic productivity and technological innovation.

4. **Scale of Impact**: Instagram's 2+ billion users mean that Mr. Zhu's integrity improvements have a disproportionately large positive effect on American society and global internet safety standards.

5. **Exceptional Qualifications**: Mr. Zhu's combination of elite academic training (Columbia, Stanford, Ohio State) and hands-on experience building AI systems at Meta and Bank of America positions him as a uniquely qualified professional whose continued presence in the U.S. serves the national interest.
