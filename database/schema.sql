-- ==============================================================================
-- PROJECTFLOW AI - ENTERPRISE POSTGRESQL DATABASE SCHEMA DDL
-- Multi-Tenant Project Management & Defense Engineering Tracking System
-- Version: 3.0.0
-- Localization: India (INR, IST Asia/Kolkata, FY April-March)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. ENUMS & DOMAIN TYPES
-- ==============================================================================

CREATE TYPE user_role AS ENUM (
    'Super Admin',
    'Organization Admin',
    'Project Manager',
    'Team Lead',
    'Developer/Member',
    'QA Engineer',
    'Procurement Officer',
    'Client Representative'
);

CREATE TYPE workstream_type AS ENUM (
    'Software',
    '3D Modelling',
    'Hardware',
    'Mechanical',
    'Electrical',
    'Testing',
    'Integration',
    'Procurement',
    'UI/UX',
    'Deployment'
);

CREATE TYPE task_status AS ENUM (
    'Backlog',
    'Selected',
    'In Progress',
    'Review',
    'Testing',
    'Approved',
    'Completed',
    'Blocked'
);

CREATE TYPE task_priority AS ENUM (
    'Low',
    'Medium',
    'High',
    'Critical',
    'Blocker'
);

CREATE TYPE approval_status AS ENUM (
    'none',
    'pending',
    'approved',
    'rejected'
);

CREATE TYPE notification_severity AS ENUM (
    'info',
    'success',
    'warning',
    'critical',
    'emergency'
);

CREATE TYPE notification_category AS ENUM (
    'tasks',
    'projects',
    'chat',
    'mentions',
    'approvals',
    'sprints',
    'meetings',
    'timesheets',
    'leave',
    'procurement',
    'budget',
    'risks',
    'system',
    'ai'
);

CREATE TYPE conversation_type AS ENUM (
    'direct',
    'team',
    'department',
    'project',
    'task',
    'group',
    'announcement',
    'ai',
    'client'
);

-- ==============================================================================
-- 2. ORGANIZATIONS & DEPARTMENTS
-- ==============================================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(100) NOT NULL UNIQUE, -- e.g. edgeforce.in
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    head_user_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 3. USERS & 3-TIER MANPOWER REPORTING HIERARCHY
-- ==============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    google_account_id VARCHAR(255) UNIQUE,
    google_email VARCHAR(255),
    is_google_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),
    role user_role NOT NULL DEFAULT 'Developer/Member',
    designation VARCHAR(150),
    avatar_url TEXT,
    hourly_rate_inr NUMERIC(12, 2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'Active',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(100),
    
    -- 3-Tier Reporting Relationships
    functional_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    project_lead_id UUID REFERENCES users(id) ON DELETE SET NULL,
    administrative_manager_id UUID REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Organization Invitations
CREATE TABLE organization_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    invited_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    invitation_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Accepted, Expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 4. PROJECTS, SPRINTS & TASKS
-- ==============================================================================

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    key VARCHAR(20) NOT NULL UNIQUE, -- e.g. BMP2, DRONE
    name VARCHAR(255) NOT NULL,
    description TEXT,
    lead_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    total_budget_inr NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    spent_budget_inr NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    health VARCHAR(50) DEFAULT 'On Track',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    goal TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Active', -- Future, Active, Closed
    velocity_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES sprints(id) ON DELETE SET NULL,
    key VARCHAR(50) NOT NULL UNIQUE, -- e.g. BMP2-101
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'Task', -- Task, Bug, Story, Milestone, Subtask
    workstream workstream_type NOT NULL DEFAULT 'Software',
    status task_status NOT NULL DEFAULT 'Backlog',
    priority task_priority NOT NULL DEFAULT 'Medium',
    
    assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    story_points INTEGER DEFAULT 0,
    estimated_hours NUMERIC(8, 2) DEFAULT 0.0,
    actual_hours NUMERIC(8, 2) DEFAULT 0.0,
    progress INTEGER DEFAULT 0,
    
    start_date DATE,
    due_date DATE,
    
    approval_status approval_status DEFAULT 'none',
    approval_comment TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE task_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    position INTEGER DEFAULT 0
);

CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE time_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hours NUMERIC(8, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    hourly_rate_inr NUMERIC(10, 2) NOT NULL,
    cost_inr NUMERIC(12, 2) NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 5. PROCUREMENT & BILL OF MATERIALS (BOM)
-- ==============================================================================

CREATE TABLE bom_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    item_code VARCHAR(100) NOT NULL,
    name VARCHAR(255) NOT NULL,
    workstream workstream_type NOT NULL,
    category VARCHAR(100),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price_inr NUMERIC(12, 2) NOT NULL,
    gst_rate_percent NUMERIC(5, 2) DEFAULT 18.00,
    total_cost_inr NUMERIC(14, 2) NOT NULL,
    supplier VARCHAR(255),
    lead_time_days INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, Requested, Approved, Ordered, In Transit, Received, Rejected
    approval_level VARCHAR(50) DEFAULT 'Team Lead',
    requested_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 6. REAL-TIME CHAT & CONVERSATIONS
-- ==============================================================================

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    type conversation_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT FALSE,
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_members (
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT,
    reply_to_message_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_forwarded BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Voice Note & Attachments JSON payload
    voice_note_metadata JSONB,
    attachments JSONB,
    reactions JSONB,
    mentions UUID[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 7. NOTIFICATIONS & PREFERENCES
-- ==============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category notification_category NOT NULL,
    severity notification_severity NOT NULL DEFAULT 'info',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sound_effect VARCHAR(100),
    reference_type VARCHAR(100),
    reference_id VARCHAR(255),
    snoozed_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    master_volume NUMERIC(3, 2) DEFAULT 0.80,
    chat_volume NUMERIC(3, 2) DEFAULT 0.70,
    alert_volume NUMERIC(3, 2) DEFAULT 0.90,
    sound_enabled BOOLEAN DEFAULT TRUE,
    sound_only_for_mentions BOOLEAN DEFAULT FALSE,
    critical_alerts_override_dnd BOOLEAN DEFAULT TRUE,
    quiet_hours_enabled BOOLEAN DEFAULT TRUE,
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '07:00:00',
    dnd_active BOOLEAN DEFAULT FALSE,
    in_app_enabled BOOLEAN DEFAULT TRUE,
    browser_desktop_enabled BOOLEAN DEFAULT TRUE,
    mobile_push_enabled BOOLEAN DEFAULT FALSE,
    email_enabled BOOLEAN DEFAULT TRUE,
    privacy_mode BOOLEAN DEFAULT FALSE
);

-- ==============================================================================
-- 8. 5-STAGE MANPOWER ALERT ESCALATIONS
-- ==============================================================================

CREATE TABLE alert_escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    current_stage INTEGER NOT NULL DEFAULT 1, -- 1 to 5
    stage_label VARCHAR(100) NOT NULL,
    severity notification_severity NOT NULL DEFAULT 'warning',
    escalated_to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    escalated_to_role VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by_user_id UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by_user_id UUID REFERENCES users(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    sla_deadline TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 9. AUDIT LOGS & SECURITY TRAIL
-- ==============================================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_name VARCHAR(150),
    action VARCHAR(255) NOT NULL,
    target VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- 10. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_chat_messages_conv ON chat_messages(conversation_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
CREATE INDEX idx_escalations_task ON alert_escalations(task_id);
