#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

## user_problem_statement: |
  User wants to unify the existing dual-platform TecaiKids educational website into one comprehensive 
  platform covering ages 4-16 with unified age-based levels: Little Learners (4-6), Young Explorers (7-9), 
  Smart Kids (10-12), Tech Teens (13-15), Future Leaders (16+). The platform needs comprehensive payment 
  integration including Stripe, Bank of Ceylon transfer, eZ Cash, and quarterly subscription system with 
  physical workbook delivery designed by ex-NIE educationist. Both platform unification AND payment 
  system integration are required.

## backend:
  - task: "Unified User Management System"
    implemented: false
    working: false
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Need to merge separate kid/teen APIs into unified age-based system"

  - task: "Payment Integration - Stripe"
    implemented: false
    working: false
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Stripe integration needed for credit card payments"

  - task: "Payment Integration - Bank Transfer"
    implemented: false
    working: false
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Bank of Ceylon transfer integration needed"

  - task: "Payment Integration - eZ Cash"
    implemented: false
    working: false
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "eZ Cash Sri Lankan payment method integration needed"

  - task: "Quarterly Subscription System"
    implemented: false
    working: false
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Subscription management with quarterly billing and workbook delivery tracking"

  - task: "Workbook Management System"
    implemented: false
    working: false
    file: "backend/server.py"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Track physical workbook delivery every 3 months for all age groups"

## frontend:
  - task: "Unified Age Selector"
    implemented: false
    working: false
    file: "frontend/src/pages/UnifiedAgeSelector.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Merge AgeSelector and TeenSelector into one unified component with 5 age levels"

  - task: "Unified Dashboard"
    implemented: false
    working: false
    file: "frontend/src/pages/UnifiedDashboard.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Single dashboard that adapts content based on age level (4-16)"

  - task: "Payment Integration UI"
    implemented: false
    working: false
    file: "frontend/src/components/PaymentComponent.jsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Payment selection UI for Stripe, Bank transfer, eZ Cash"

  - task: "Subscription Management UI"
    implemented: false
    working: false
    file: "frontend/src/components/SubscriptionManager.jsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Quarterly subscription and workbook tracking interface"

  - task: "Updated Navigation"
    implemented: false
    working: false
    file: "frontend/src/App.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
        - working: false
          agent: "main"
          comment: "Update routing to use unified components instead of separate kid/teen paths"

## metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

## test_plan:
  current_focus:
    - "Unified User Management System"
    - "Unified Age Selector"
    - "Payment Integration - Stripe"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

## agent_communication:
    - agent: "main"
      message: "Starting unified TecaiKids platform implementation. Need to merge dual platform into single age-based system (4-16) with comprehensive payment integration and quarterly subscription system."