# AWS Work Contributions — Per-Sprint Task List (2025)
**Ashwin John Chempolil (ashwinjc)**
Teams: AWS Verified Governance & Access | RAM (CARS) → Hobbes Platform
Period: January – December 2025

---

## Overview

| Quarter | Theme | Key Deliverables |
|---|---|---|
| Q1 (Jan–Mar) | TRex Regional Expansion + Mechanic | Region expansion infra, plugin migration, CFN recovery |
| Q2 (Apr–Jun) | ServiceDiscovery + CloudTrail Backfill | Cloud Map onboarding, CloudTrail Lambda, cross-org foundation |
| Q3 (Jul–Sep) | CARDIO + Hobbes Platform Launch | Cross-region messaging, Hobbes infra from scratch, IAM auth |
| Q4 (Oct–Nov) | Hobbes Feature Delivery + Security | Doc Review, event filtering, token introspection, GitHub private repos |

---

## SPRINT 1 — Jan 13–31, 2025
### TRex Infrastructure Foundation
_Focus: Setting up CARS TRex (Touchless Region Expansion) infrastructure for automated region expansion_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **Add Dagger DI to TRex integration tests** | **S:** Integration tests lacked proper DI framework. **A:** Added Dagger runtime + Guice DI, updated test bootstrap components. **R:** Cleaner test isolation and maintainability. |
| 2 | **IAM permissions for Hydra role (DynamoDB, Step Functions, RAM)** | **S:** Hydra integration test role lacked permissions for DynamoDB (region expansion works table), Step Functions (state machine), and RAM operations. **A:** Added `dynamodb:*`, `states:*`, `ram:*` policy statements to CARSTRexCDK. **R:** Unblocked Hydra tests to validate full region expansion workflow. |
| 3 | **Add CARSTRexCommon to autobuild pipeline** | **S:** Package was not in CI/CD pipeline, requiring manual builds. **A:** Added to `addPackageToAutobuild` list. **R:** Consistent automated builds for shared utilities. |
| 4 | **Refactor: Move common utils/constants to CARSTRexCommon** | **S:** `RegionExpansionConstants`, `DateHelpers`, `UtilityHelpers` duplicated across packages. **A:** Moved to CARSTRexCommon, updated imports across 2 packages. **R:** DRY codebase with centralized shared utilities. |
| 5 | **Add AWS account ID env var to Hydra workflow** | **S:** Hydra workflow lacked account context needed for region-specific API calls. **A:** Added environment variable injection to CDK. **R:** Hydra tests can resolve account IDs dynamically. |
| 6 | **Integration tests + utility consolidation (3-package refactor)** | **S:** Test coverage was incomplete across packages. **A:** Created `CARSTRexTest` with pre-release/release/rollback workflows; added `SfnClient` for state machine validation. **R:** Comprehensive integration test coverage across 3 packages. |
| 7 | **Bug: Fix DynamoDB item lookup for canary status tracking** | **S:** Region expansion canary status was updating wrong DDB items — pre-release and release phases have different partition keys. **A:** Added `releaseToCustomers` boolean param to `updateStatus()` and `getCanaryStatus()`. **R:** Accurate canary status tracking throughout full expansion lifecycle. |
| 8 | **Auto-set console complete for test resource types in gamma** | **S:** Gamma testing required manual console completion step even for `emoji:dino` test resource type. **A:** Modified `CreateRegionExpansionTaskActivity` to set `completedManualStep=true` for test types in aws/aws-unit-test partitions. **R:** Streamlined gamma testing, eliminated unnecessary manual step. |
| 9 | **Implement release test workflow in integration tests** | **S:** Tests only covered pre-release; release and rollback had zero validation. **A:** Added `runReleaseResourceTypeTest` with state machine validation for RELEASE mode. **R:** Full integration test coverage for the complete expansion lifecycle. |
| 10 | **Revert stack naming for ADC deployment unblock** | **S:** Naming change blocked ADC deployments. **A:** Reverted to original stack naming. **R:** ADC deployment pipeline unblocked. |

---

## SPRINT 2 — Feb 3–28, 2025
### CARSMechanic Refactoring + Automation
_Focus: Operational tooling improvements and CFN recovery automation_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **Refactor CARSMechanic to use TRex Ruby client** | **S:** CARSMechanic used a custom `ApigService` with hardcoded endpoints per region for TRex communication — any new region required code changes. **A:** Replaced custom implementation with official TRex Ruby SDK client across 3 revisions. **R:** Multi-region TRex API calls now use auto endpoint resolution via official SDK; eliminated per-region hardcoding. |
| 2 | **CARSCanaryOrchestrator telemetry enhancements** | **S:** Canary orchestrator lacked telemetry for diagnosing failures. **A:** Added structured telemetry/metrics instrumentation. **R:** Improved observability for canary run diagnostics. |
| 3 | **CloudFormation auto-recovery for UPDATE_ROLLBACK_FAILED stacks** | **S:** Stacks stuck in `UPDATE_ROLLBACK_FAILED` required manual intervention, blocking deployments in ADC regions. **A:** Built Lambda-based auto-recovery system that detects stuck stacks and triggers `ContinueUpdateRollback`. **R:** Eliminated manual intervention for a common operational failure mode; reduced deployment blockers. |
| 4 | **CARSWikiLpt feature additions** | **S:** Wiki tooling needed enhancements for team documentation workflows. **A:** Implemented new feature in CARSWikiLpt. **R:** Improved team documentation tooling. |
| 5 | **Multiple bug fixes across CARS services** | **S:** Several regressions identified across CARS services in February. **A:** Investigated, diagnosed, and shipped fixes across multiple packages. **R:** Service stability maintained. |

---

## SPRINT 3 — Mar 3–31, 2025
### RAM Plugin Migration + Regional Config
_Focus: Large-scale plugin migration and GovCloud/China regional configuration_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **RAM plugin migration (31 services, 638 tasks)** | **S:** Legacy `ChainReactionRAMResourceTypeSupportPlugin` needed migration to new `RAMResourceTypeRegionExpansion` plugin across 31+ AWS services and 638 tasks — no automation existed. **A:** Built comprehensive CLI tool with `--listServices`, `--listCTIs`, `--generate-inputs`, `--apply`, `--rollback` commands; implemented task conversion logic with validation. **R:** Enabled operators to safely migrate 638 tasks across 31 services with automated rollback; reduced manual migration effort by ~95%. |
| 2 | **Console completion alarm routing fix** | **S:** Console completion alarms routed to generic RAM Console resolver group instead of TRex-specific group, slowing incident triage. **A:** Updated alarm configuration to route to correct TRex-specific resolver. **R:** Console completion alerts now route correctly for faster on-call triage. |
| 3 | **DataZone permission release status sync** | **S:** CARSDefaultPermissions had DataZone domain extended service access with `is_released=false` but production cells had `is_released=true` — audit gap. **A:** Synchronized release status between code and production config. **R:** Config drift resolved; audit compliance restored. |
| 4 | **Allowlist RAM console accounts in gamma** | **S:** RAM console accounts not allowlisted in gamma, blocking console-based resource sharing workflow testing. **A:** Updated `CARSCDKCommon` and `CARSServiceSDCConfigData` with account allowlist entries. **R:** RAM console testing enabled in gamma. |
| 5 | **CARSCanaryOrchestrator refactoring + feature additions** | **S:** Canary orchestrator code needed cleanup and new capability additions. **A:** Refactored orchestrator structure, added new features. **R:** Cleaner, more maintainable canary runner. |
| 6 | **Create console complete alarms for commercial regions** | **S:** Alarms only monitored non-commercial and gamma; commercial regions had no console completion monitoring during region expansion. **A:** Removed conditional partition/domain check in `alarmStack.ts`; updated `CreateRegionExpansionTaskActivity.kt` to prevent premature marking in commercial regions. **R:** Comprehensive console monitoring across all regions. |

---

## SPRINT 4 — Apr 2–25, 2025
### ServiceDiscovery Onboarding + ADC Regional Fixes
_Focus: New resource type onboarding (AWS Cloud Map) and ADC/China partition fixes_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **ServiceDiscovery namespace adaptor for AWS Cloud Map** | **S:** RAM had no support for sharing AWS Cloud Map namespace resources across accounts — required new adaptor from scratch. **A:** Created `ServicediscoveryAdaptor.kt` (365 lines) implementing `AbstractNonCoralAdaptor`; integrated `AWSServiceDiscoveryPreviewJavaClient`; implemented `callPutResourcePolicy`, `callGetResourcePolicy`, `callDeleteResourcePolicy`. **R:** Enabled Cloud Map namespace cross-account sharing via RAM across 4 packages (CARSAdaptor, CARSAdaptorCommon, CARSAdaptorTests, CARSCommon). |
| 2 | **Home regions for non-commercial partitions (China, GovCloud, ISO)** | **S:** Global resource types in China (BJS/ZHY), GovCloud (PDT), and ISO partitions (DCA, LCK, NCL, ALE) defaulted to wrong home regions. **A:** Added partition/region constants; configured `homeRegion` mapping for each non-commercial partition in `CARSCommon` and `CARSService`. **R:** Correct global resource type routing across all AWS partitions; 100% new line coverage. |
| 3 | **Cloud Map namespace onboarding to RAM (5-package, AppSec review)** | **S:** RAM service needed Cloud Map as an officially supported resource type — required service allowlists, routing config, AppSec threat model. **A:** Shipped across 5 packages; added Cloud Map beta service principal (`us-west-2.beta.testing.cloudmap.aws.internal`) per AppSec requirement. **R:** Cloud Map namespace resource type officially onboarded to RAM enabling cross-account namespace sharing. |
| 4 | **Container policy generation for ServiceDiscovery nested resources** | **S:** ServiceDiscovery namespace needed container policy support for nested service resources but existing infrastructure didn't handle wildcard resource IDs. **A:** Added `SERVICEDISCOVERY_SERVICE_NESTED_RESOURCE_TYPE` constant; created `CONTAINER_MEMBER_RESOURCE_TYPE_WITH_WILDCARD_RESOURCE_ID` set; updated container policy generation. **R:** Enabled sharing of nested ServiceDiscovery service resources. |
| 5 | **BillingView canary fix for China region (BJS → ZHY endpoint)** | **S:** BillingView canary tests in BJS (cn-north-1) failed — billing service in China requires routing to ZHY (cn-northwest-1). **A:** Fixed `self.region` reference; added `ZHY_PROD_RESOURCE_TYPES` routing logic for Lambda client initialization. **R:** China region BillingView canary tests passing. |
| 6 | **Enable Organizations sharing in ADC regions** | **S:** Canary orchestrator skipped AWS Organizations setup in ADC regions, preventing orgs-based resource sharing tests. **A:** Removed `is_adc_region()` guard; reordered ops so `invite_and_accept_handshake` runs before `setup_account`. **R:** Orgs-based sharing canary tests now run in ADC (Air-gapped) regions. |
| 7 | **Opt-in event routing for non-commercial partitions** | **S:** Opt-in account events in `aws-iso-f` partition were routed to hardcoded `us-east-1` instead of correct partition leader region. **A:** Changed `CARSAccountEvent.java` to use `getPartitionLeader()`; added `isAwsAccountOptinRequired()` check. **R:** Correct opt-in event routing in ISOF (LTW/ALE regions); 100% new line coverage. |
| 8 | **BillingView allowlist for ADC regions (47 accounts, 10 SPs)** | **S:** BillingView resource type missing from ADC allowlists in SC2S/C2S/LCK/DCA regions. **A:** Added 47 account entries to `RAMAdditionalResourceTypeAllowlistForLegacyADC.rb`; moved 10 service principal entries. **R:** BillingView resource sharing enabled in ADC regions. |
| 9 | **Ruby runtime upgrade 2.7 → 3.2 (CARSCellRouter, CARSCommon, CARSService)** | **S:** SAS risk campaign flagged Ruby 2.7 as deprecated across multiple CARS packages. **A:** Updated Config files in 3 packages to use `Ruby32x = 1.0`. **R:** Standardized Ruby runtime to 3.2 across CARS codebase. |
| 10 | **AWS CLI v2 compliance for CARSMechanic hosts** | **S:** CARSMechanic hosts using outdated CLI, triggering PolicyEngine dogma violation. **A:** Added `AwsCli/V2Latest/Prod` to consumed environments in service template. **R:** PolicyEngine violation resolved; compliance maintained. |

---

## SPRINT 5 — May 1–29, 2025
### CloudTrail Backfill Infrastructure
_Focus: Building Lambda-based CloudTrail event backfill for non-commercial partitions_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **CloudTrail helper constants migration to CARSCommon** | **S:** CloudTrail constants scattered across packages causing duplication. **A:** Migrated shared CloudTrail helper constants into `CARSCommon`. **R:** Centralized constants; DRY codebase. |
| 2 | **Move CloudTrail infra to CARSAdaptorService pipeline** | **S:** CloudTrail infrastructure was deployed separately; needed integration into main adaptor pipeline. **A:** Moved CloudTrail infrastructure CDK stacks to `CARSAdaptorServiceCDK`; added to pipeline. **R:** CloudTrail infra managed through standard pipeline. |
| 3 | **Initial CloudTrail event backfill Lambda** | **S:** Non-commercial partitions (GovCloud, China, ISO) had compliance gaps — CloudTrail events were never backfilled for these regions. **A:** Created `CARSCloudtrailEventBackfillLambda` with initial implementation; added debug logging for event processing. **R:** Foundation for automated CloudTrail compliance in all partitions. |
| 4 | **SQS event source trigger for CloudTrail Lambda** | **S:** CloudTrail backfill Lambda needed event-driven invocation from SQS. **A:** Added SQS event source trigger in `CARSAdaptorServiceInfrastructureCDK`; configured visibility timeout to prevent duplicate processing. **R:** CloudTrail Lambda now processes events asynchronously via SQS. |
| 5 | **Lambda concurrency + performance configuration** | **S:** Lambda concurrency limits not configured, risking throttling during backfill. **A:** Configured reserved concurrency and performance settings in CDK. **R:** Reliable throughput for backfill operations. |
| 6 | **CloudTrail allowlist for RAM accounts** | **S:** RAM service accounts not in `CloudTrailCustomerFeaturesSDCConfigData` allowlist, blocking CloudTrail integration. **A:** Added RAM accounts to CloudTrail feature allowlist. **R:** RAM CloudTrail integration enabled. |
| 7 | **CloudTrail audit script: event type filtering** | **S:** CARSMechanic CloudTrail audit script lacked filtering by event type, making analysis of large event sets difficult. **A:** Added `--event-type` filtering parameter to CloudWatch query logic. **R:** Faster, more targeted CloudTrail audit analysis for operators. |
| 8 | **CARSMechanic: Email ID retrieval for internal accounts** | **S:** Internal account detection in canary only checked account IDs; needed email-based detection for comprehensive coverage. **A:** Added email ID retrieval for internal accounts; expanded canary account detection to include AWS email addresses. **R:** More accurate internal account detection in canary runs. |

---

## SPRINT 6 — Jun 2–18, 2025
### Cross-Organization Resource Sharing + CloudTrail Hardening
_Focus: Cross-org sharing feature and CloudTrail operational tooling improvements_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **SQS event source optimization for CloudTrail** | **S:** CloudTrail Lambda SQS event source had suboptimal batching settings causing inefficient processing. **A:** Optimized SQS event source configuration in CDK. **R:** More efficient CloudTrail event processing. |
| 2 | **Lambda timeout increase for batch processing** | **S:** Lambda timeout was too low for large CloudTrail event batches, causing timeouts during backfill. **A:** Increased Lambda timeout in CDK configuration. **R:** Backfill operations complete reliably for large event volumes. |
| 3 | **Cross-org resource sharing context + API** | **S:** RAM had no mechanism for resources to be shared across organization boundaries. **A:** Added `CARSCommon` and `CARSService` cross-org sharing context; designed API for cross-organization invitations and associations. **R:** Foundation for cross-org resource sharing capability. |
| 4 | **Enable multiple organization ARNs for cross-org** | **S:** Cross-org sharing limited to single org ARN; enterprise customers have multiple org ARNs. **A:** Updated `CARSService` to support multiple organization ARNs in sharing config. **R:** Enterprise-grade cross-org sharing supporting multiple organizations. |
| 5 | **S3 integration for CloudTrail events storage** | **S:** CloudTrail events processed in-memory with no persistence for large event sets exceeding SQS message limits. **A:** Added S3 integration to CARSMechanic for CloudTrail events storage; added configurable message count for delivery. **R:** Large CloudTrail event sets persisted to S3; configurable batch sizes. |
| 6 | **ITAR region ownership update** | **S:** ITAR region ownership in CARSMechanicLpt pointed to outdated POSIX group. **A:** Updated ITAR region ownership to GovCloud POSIX group. **R:** Correct operational ownership for ITAR compliance. |

---

## SPRINT 7 — Jul 15–31, 2025
### CARDIO Cross-Region Infrastructure (MDW Destination Queues)
_Focus: Building cross-region message propagation (CARDIO) with SQS Extended Client for large payloads_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **MDW Destination Queues for CARS message propagation** | **S:** Cross-region RAM resource sharing needed a message delivery infrastructure (CARDIO) to propagate events across regions. **A:** Created MDW destination queues in `CARSIntegrationInfrastructure`; restricted to IAD leader region. **R:** Foundation for cross-region event propagation in RAM. |
| 2 | **SDC config for cross-org sharing** | **S:** Cross-org sharing needed SDC (Service Discovery Config) configuration to enable service principal lookup. **A:** Added `CARSServiceSDCConfigData` entries for cross-org sharing. **R:** Cross-org sharing enabled via SDC-driven configuration. |
| 3 | **Refactor cross-org sharing to use SDC** | **S:** Cross-org code used hardcoded config; needed to use SDC for dynamic configuration. **A:** Refactored `CARSCommon`, `CARSDataAccess`, `CARSService` to use SDC. **R:** Dynamic, config-driven cross-org sharing across 3 packages. |
| 4 | **CARDIO centralized destination propagation in leader region** | **S:** Destination propagation scattered across regions; needed centralization in leader region for consistency. **A:** Centralized propagation queues in leader region; added `PurgeQueue` action to queue policy; implemented cross-region role assumption for receiving. **R:** Reliable, centralized cross-region event propagation. |
| 5 | **SQS Extended Client for large messages (S3-backed)** | **S:** Large RAM sharing messages exceeded SQS 256KB limit, causing message delivery failures. **A:** Implemented SQS Extended Client using S3 bucket for large message payloads; added S3 encryption key; fixed STS client region for cross-region role assumption. **R:** Large message handling resolved; messages of any size delivered reliably. |
| 6 | **Destination DLQ alarms (CARSCardioAlarmsInfrastructureCDK)** | **S:** No monitoring on destination dead-letter queues; failures would go undetected. **A:** Created CloudWatch alarms for destination DLQs; moved alarms for PDX gamma. **R:** Operational visibility for CARDIO delivery failures. |
| 7 | **Get CARDIO service accounts from RIP** | **S:** CARDIO service accounts hardcoded; needed dynamic resolution via RIP (Regional Infrastructure Provider). **A:** Updated `CARSCommon` and `CARSIntegration` to resolve CARDIO service accounts from RIP. **R:** Dynamic account resolution; eliminated hardcoded account IDs. |

---

## SPRINT 8 — Aug 1–28, 2025
### Cross-Org Sharing Completion + ServiceDiscovery Onboarding
_Focus: Shipping cross-org sharing invitations/associations and Cloud Map namespace support_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **Cross-org sharing invitations and allowlist** | **S:** Cross-org sharing needed user-facing invitation workflow and allowlist management. **A:** Created invitations flow and allowlist in `CARSAsyncLambda`, `CARSAsyncWF`, `CARSCommon`. **R:** Cross-org sharing invitations and acceptance flow delivered. |
| 2 | **Full cross-org invitation + association handling (4-package)** | **S:** End-to-end cross-org invitation, acceptance, and resource association workflow not complete. **A:** Shipped full workflow across `CARSAsyncWF` and 3 more packages. **R:** Complete cross-org sharing workflow shipped to production. |
| 3 | **CARDIO bug fix: STS client region for cross-region messaging** | **S:** Cross-region STS client was created in the wrong region causing assume-role failures for cross-region message receipt. **A:** Fixed STS client initialization to use queue region. **R:** Cross-region message receipt working correctly. |
| 4 | **Cloud Map ECS managed permission for ServiceDiscovery** | **S:** AWS Cloud Map needed ECS managed permission in `CARSDefaultPermissions` to enable namespace sharing. **A:** Added `Cloud Map ECS managed permission` with `ripServiceName: servicediscovery`. **R:** Cloud Map namespace sharing permissions available to RAM customers. |
| 5 | **TRex bug fix: Don't block RAM when RIP service name missing** | **S:** Missing `ripServiceName` in TRex caused RAM service to throw exceptions, blocking region expansion. **A:** Updated `CARSTRexService` to gracefully handle missing RIP service name instead of blocking. **R:** RAM service resilient to missing TRex config; region expansion unblocked. |
| 6 | **Turtle roles for cross-org sharing testing** | **S:** Cross-org sharing integration tests needed test roles (turtle roles) for multi-account validation. **A:** Added turtle roles config to `CARSMechanic`; fixed missing semicolon bug. **R:** Integration testing infrastructure for cross-org sharing complete. |
| 7 | **Remove redundant accounts from cross-org allowlist** | **S:** Cross-org allowlist had redundant account entries causing config bloat. **A:** Removed redundant accounts from `CARSDataAccess`. **R:** Clean allowlist configuration. |

---

## SPRINT 9 — Sep 1–30, 2025
### Hobbes Platform Launch: IAM Auth, DNS, Communication Service
_Focus: Full transition to Hobbes team — built IAM auth, DNS infrastructure, and Communication Service from scratch_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **ServicePrincipalStack CDK construct** | **S:** Manual service principal setup in Hobbes was error-prone and inconsistent — no automation existed. **A:** Designed and built `ServicePrincipalStack` with `createGlobalServicePrincipal()` and `createRegionalServicePrincipal()` methods; `ServicePrincipalAssociationStack` for bindings; `getAccountAlias()` utility; dedicated wave configuration. **R:** Service principal provisioning reduced from hours to minutes; team self-service; eliminated config drift across 8+ services. |
| 2 | **Account alias validation (bug fix)** | **S:** CDK deployments failing — account alias with `+` symbol didn't match IAM alias regex. **A:** Created `validateAccountAlias()` with regex `^[a-z0-9]([a-z0-9]\|-(?!-))*[a-z0-9]$`; sanitized invalid characters in `getAccountAlias()`. **R:** Deployment failures eliminated; all future aliases validated at build time. |
| 3 | **IAM cross-account auth for Hobbes Frontend Service** | **S:** HoFE needed SigV4-signed cross-account auth — no IAM auth existed in Hobbes services. **A:** Created `AuthRuntimeRole` with ARS permissions (`ars:Authenticate`, `ars:GetPolicies`, `ars:GetPrincipal`, `ars:requestFAS`); implemented `AwsCustomResource` to patch API Gateway; added `@authorizer` annotation to Smithy model. **R:** IAM cross-account auth deployed with FAS policy integration; 92.85% new line coverage; presented at sprint demo. |
| 4 | **IAM auth for Hobbes Storage Service** | **S:** HoSS needed identical IAM auth pattern established for HoFE. **A:** Created `createAuthRuntimeRole()` with ARS permissions; implemented `createAndPatchAuthRuntimeRole()` custom resource. **R:** Cross-account IAM authentication verified with test API calls. |
| 5 | **HobbesStorage IAM permissions rollout (8 services)** | **S:** 8 Hobbes services (SecureCode, Metamodel, ThreatModel, Frontend, DocFeedback, Storage, and others) all needed `hobbesstorage:*` IAM policies to interact with Storage Service — no automation for this pattern existed. **A:** Added `hobbesStorageApiAccessPolicy` `PolicyStatement` to each service's CDK stack; added `securitytesting:*` for Hydra integration test role. **R:** All Hobbes services unblocked for Storage Service interactions; pattern reused across team. |
| 6 | **Custom DNS domain infrastructure** | **S:** Hobbes services had no DNS — internal APIs had raw endpoint URLs with no stable routing. **A:** Created `CustomDomain` and `DnsStack` CDK constructs with Route53 hosted zones, ACM certificates, API Gateway custom domain mapping; added DNS validation + 49 unit tests covering all scenarios. **R:** DNS infrastructure deployed; stable API endpoints at `*.hobbes.identity.aws.dev`; prevented 64-char limit deployment failures. |
| 7 | **Communication Service AWS accounts + service principals** | **S:** New Hobbes Communication Service needed AWS account infrastructure from scratch. **A:** Created `CommunicationPipelineAccount` and `CommunicationServiceAccount`; added service principal associations; configured trusted services (PipelinesCloudformation, Hydra). **R:** Account infrastructure established, enabling pipeline deployments. |
| 8 | **Communication Worker infrastructure (ECS Fargate + SQS + DynamoDB)** | **S:** Hobbes Communication Service needed long-running worker for async chat event processing — no infrastructure existed. **A:** Created `CommunicationWorkerStack` with ECS Fargate (`BrazilContainerImage`); `PersistanceStack` with encrypted DynamoDB (14-day retention), SQS queues (3-retry DLQ); developer tooling scripts (`devstack deploy`). **R:** Complete Communication Worker infrastructure delivered; encrypted DynamoDB + Fargate cluster with Container Insights. |
| 9 | **Fix Route53 cross-account delegation permissions** | **S:** DNS stack deployments failing — delegation role lacked explicit Route53 permissions. **A:** Added `PolicyDocument` with `Route53:ChangeResourceRecordSets` and `ListHostedZonesByName`; removed redundant `grantDelegation()` calls. **R:** DNS deployment failures resolved across all Hobbes services. |
| 10 | **ListProviderResources API (GitHub + Slack, Strategy Pattern)** | **S:** Integration Mediation Service needed to list available resources from GitHub (repos) and Slack (channels) using different auth mechanisms — no unified API existed. **A:** Implemented Strategy Pattern with `ProviderStrategy` interface and `ResourceProviderFactory`; `GithubProviderStrategy` calling `/orgs/{enterpriseId}/repos`; `SlackProviderStrategy` via Miyu proxy; refactored `ProviderResource` to Smithy union type with `GithubProviderResource` and `SlackProviderResource`. **R:** Extensible provider resource listing across 4 packages; 87.25% line coverage; clean architecture for future providers. |
| 11 | **GetIntegratedResource API (Storage Service)** | **S:** No API to retrieve integrated resource details from DynamoDB by composite key. **A:** Implemented `GetIntegratedResourceActivity`; updated `IntegratedResourceDdbRepository` to return `Optional<IntegratedResource>`; added fields to Smithy model. **R:** Resource retrieval enabled; 96.55% new line coverage. |
| 12 | **ListResourcesFromIntegration API (Frontend Service)** | **S:** Web console had no way to display available provider resources for user selection. **A:** Implemented across 3 packages; created activity with `HobbesIntegrationMediationClient` integration; implemented resource mapping for both provider types. **R:** New API enabling resource listing for integrations; 90% new line coverage. |

---

## SPRINT 10 — Oct 1–31, 2025
### Hobbes Feature Delivery: Event Filtering + Document Q&A + Doc Review
_Focus: Event filtering system, DocFeedback Q&A workflow, and Document Review data model_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **Event filtering for Integration Mediation (dual-mode)** | **S:** Integration Mediation had no control over which GitHub/Slack events to process — all events were forwarded regardless of configuration. **A:** Created `EventFilterService` with `AppConfigWrapper`; dual-mode: dev stages block all events unless allowlisted; non-dev stages process all unless explicitly blocked. Provider-specific allowlists for `SLACK` and `GITHUB` with `Map<Provider, Set<String>>`. **R:** Fine-grained event filtering across all stages; addressed 22 review comments across 3 revisions. |
| 2 | **Global exception translator interceptor (3 services)** | **S:** Activities in HoFE, Communication Service, and Integration Mediation had scattered `try-catch` blocks causing code duplication and inconsistent error handling across 6+ exception types. **A:** Created `HobbesExceptionTranslatorInterceptor` as `GlobalInterceptor` in each service; mapped AWS SDK exceptions to Coral exceptions; added `ThrottlingException` and `AccessDeniedException` to Smithy models. **R:** Centralized error handling across 3 services; 89–95% new line coverage per service. |
| 3 | **Botocore package for Communication Service** | **S:** DocFeedback Worker needed a Python boto3 client for Hobbes Communication Service API. **A:** Created `AWSHobbesCommunicationServiceBotocore` using botocore-c2j build system; configured `hobbescommunication:*` IAM permissions. **R:** DocFeedback Worker can call `echo` and `ingest_chat_message` via boto3. |
| 4 | **Chat Sessions DynamoDB table** | **S:** Communication Service had no storage for session reverse lookups. **A:** Added encrypted `ChatSessionsTable` to `PersistanceStack`; granted Lambda read/write; injected `CHAT_SESSIONS_TABLE_NAME` env var. **R:** Session reverse lookup storage deployed. |
| 5 | **Q&A chat processing foundation (DocFeedback Worker)** | **S:** DocFeedback Worker had no document Q&A capability — users couldn't ask follow-up questions about feedback sessions. **A:** Created `DocFeedbackChatMessage` model, `MessagePoller` (SQS), `ChatEventHandler`, `DocQuestionAnsweringTask`; integrated Communication Service client. **R:** Foundation for document Q&A in feedback sessions. |
| 6 | **Document Q&A workflow with Bedrock** | **S:** Full conversational Q&A for document feedback sessions needed Bedrock AI integration. **A:** Implemented `DocQuestionAnsweringTask` with full Q&A workflow; `ConversationManager` for history; client wrappers for Communication, Mediation, Storage; migrated to Lambda Powertools structured JSON logging. **R:** Conversational document feedback with Bedrock AI responses; 59.72% new line coverage. |
| 7 | **Doc Feedback ↔ Communication Service integration** | **S:** DocFeedback Service needed to persist events in `BedrockAgentCoreMemory` via Communication Service. **A:** Added `AWSHobbesCommunicationServiceModel` and Botocore to pipeline; created `hobbesCommunicationServiceAccessPolicy`. **R:** DocFeedback events persist to BedrockAgentCoreMemory. |
| 8 | **DynamoDB models + repository classes for Document Review** | **S:** Document Review feature had no data layer — `DocumentReview` and `ReviewComment` structures needed design and implementation from scratch. **A:** Designed DynamoDB schema; implemented `DocumentReview` and `ReviewComment` DDB models; created repository utility classes with full CRUD; renamed models to new struct in StorageService. **R:** Complete data layer for Document Review; repository pattern reusable across feature. |
| 9 | **Document review workflow for web console** | **S:** Web console had no document review capability — users couldn't initiate or track document reviews. **A:** Implemented document review workflow in DocFeedback Worker; connected to Storage Service via DDB repositories. **R:** End-to-end document review workflow from web console to storage. |
| 10 | **Production service principals for Frontend** | **S:** HoFE lacked production service principal config for cross-service auth in prod. **A:** Added 5 service principals to prod allowlist (`prod.hobbes.aws.internal`, `developer.gaia.aws.internal`, etc.); added `prod.hobbes.aws.internal` to `InternalAPIs`. **R:** Production cross-service authentication enabled. |
| 11 | **Internal team account allowlisting** | **S:** Internal team accounts not allowlisted in HoFE, blocking internal testing. **A:** Added internal team accounts to Frontend allowlist. **R:** Internal testing unblocked. |

---

## SPRINT 11 — Nov 1–26, 2025
### Document Review Completion + GitHub Private Repo Security
_Focus: End-to-end Document Review delivery and security hardening for GitHub integration_

| # | Task | STAR Summary |
|---|---|---|
| 1 | **GetDocumentReviewArtifact API** | **S:** Web console had no way to retrieve completed document review artifacts for display. **A:** Implemented `GetDocumentReviewArtifact` API end-to-end across HoFE (Frontend) and HoSS (Storage); created `ddb repo utility class` for docReview. **R:** Document review artifacts retrievable via Frontend API. |
| 2 | **Enabled controls filtering for DocFeedback orchestration** | **S:** DocFeedback orchestration was processing all controls regardless of enablement status, causing unnecessary processing. **A:** Added enabled controls filtering to orchestration Lambda. **R:** Processing restricted to enabled controls; improved reliability. |
| 3 | **Remove deprecated document feedback APIs** | **S:** Old DocFeedback APIs left in codebase after migration, creating maintenance burden and confusion. **A:** Removed deprecated APIs and models from DocFeedback service. **R:** Cleaner codebase; eliminated dead code. |
| 4 | **API-based service principal allowlisting (Integration Mediation)** | **S:** Integration Mediation had no fine-grained API-level access control for service principals. **A:** Implemented SP allowlisting per API in `IntegrationMediationService`; created `createAllowlistingPerAPI` in HoMS. **R:** API-level access control for Integration Mediation service principals. |
| 5 | **Token introspection interceptor (Frontend + IdC/TIP)** | **S:** HoFE and IdC/TIP endpoints had no user identity validation — any caller with a valid token could invoke APIs. **A:** Built `Coral interceptor` calling `HobbesPT DataService:introspectToken`; added `@authorizer` annotations; re-enabled token introspection for IdC store users. **R:** User identity validated on all Frontend API calls; SEV-2 security campaign requirement met. |
| 6 | **GitHub private repository support** | **S:** Hobbes SecureCode only supported public GitHub repos — enterprise customers with private repos were blocked. **A:** Added visibility validation (`private`/`public`) to `ListProviderResources`; stored visibility in DynamoDB model; updated `PublishComments`, `FetchSourceCode`, `GetAccessToken` APIs to validate visibility; added fraud prevention to SecureCode worker; handled visibility change events when posting feedback. **R:** Private GitHub repos supported by default; comprehensive access controls across 5-point security boundary. |
| 7 | **Access Type for Integrated Provider Resources** | **S:** Integrated resources had no mechanism to distinguish access type (private vs public) — clients couldn't determine authorization requirements. **A:** Added `publicRepositoryAccess` field to `AWSHobbesAPIModelCommon`; implemented `Access Type` API in HoSS and HoFE. **R:** Clients can query access type for integrated resources; enables dynamic auth decisions. |
| 8 | **Preserve resource IDs when updating integrated resources (bug fix)** | **S:** `UpdateIntegratedResources` was recreating existing repos, losing their IDs on each update. **A:** Fixed update logic to check for existing resources before creating; preserves IDs when resource already exists. **R:** Resource IDs stable across update operations; downstream associations not broken. |
| 9 | **Lambda function naming standardization** | **S:** SR Frontend Service Lambda functions had inconsistent naming, making CloudWatch log analysis difficult. **A:** Standardized Lambda function names across `AWSHobbesFrontendServiceCDK`. **R:** Consistent Lambda names; improved operational observability. |
| 10 | **Metering payload for Secure Code Lambdas** | **S:** Secure Code Lambdas had no usage metering, blocking billing integration. **A:** Implemented metering payload for Secure Code Lambda functions. **R:** Usage metering enabled for billing integration. |
| 11 | **Docker build fixes for Secure Code + CRUX taskId skip logic** | **S:** Secure Code Docker builds failing; CRUX integration had no taskId skip logic for non-applicable invocations. **A:** Fixed Docker build configuration; added `CRUX taskId` skip logic. **R:** Secure Code Docker builds stable; CRUX integration working correctly. |

---

## Annual Metrics (2025)

| Metric | Value |
|---|---|
| Code Reviews Authored | 304+ (100% ship rate) |
| Code Reviews Completed | 784+ (15+ team members) |
| Major Features Delivered | 10+ |
| Services Enhanced | 15+ |
| Regions/Partitions Supported | 20+ (commercial, GovCloud, China, ADC) |
| Technical Design Documents | 5+ |
| Sprint Demo Presentations | 4 |
| Taskei Tasks Created | 90+ |
