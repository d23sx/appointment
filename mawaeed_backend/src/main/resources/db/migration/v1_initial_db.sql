-- 1. USER ROLE TABLE
CREATE TABLE user_role
(
    id         SERIAL PRIMARY KEY,
    role_name  VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.  USERS TABLE
CREATE TABLE users
(
    id           SERIAL PRIMARY KEY,
    username     VARCHAR(50)  NOT NULL UNIQUE,
    password     TEXT         NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20),
    ar_name      VARCHAR(100) NOT NULL,
    eng_name     VARCHAR(100) NOT NULL,
    user_role_id INT          NOT NULL,
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_role_id) REFERENCES user_role (id)
);

-- 3. site_info TABLE
CREATE TABLE site_info
(
    site_id             SERIAL PRIMARY KEY,
    site_name           VARCHAR(100) NOT NULL,
    description         VARCHAR(500),
    address             VARCHAR(255),
    phone               VARCHAR(20),
    email               VARCHAR(255),

    -- Location coordinates (mandatory for SMS/email)
    latitude            DECIMAL(10, 8),
    longitude           DECIMAL(11, 8),

    -- Operating hours
    start_time          TIME                  DEFAULT '08:00:00',
    end_time            TIME                  DEFAULT '14:00:00',

    -- Ticket numbering
    ticket_start_number INT          NOT NULL,
    ticket_max_number   INT          NOT NULL,

    -- site_info status
    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    is_non_bahraini     BOOLEAN      NOT NULL DEFAULT FALSE,

    -- Inactive site_info tracking
    inactive_start_date DATE,
    inactive_end_date   DATE,

    created_at          TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP             DEFAULT CURRENT_TIMESTAMP
);


-- 4. site_info TIME SLOT TABLE (Improved day availability)
CREATE TABLE site_time_slot
(
    id                    SERIAL PRIMARY KEY,
    site_id               VARCHAR(25) NOT NULL,
    slot_id               INT         NOT NULL,
    start_time            TIME        NOT NULL,
    end_time              TIME        NOT NULL,
    slot_duration_minutes INT       DEFAULT 60,
    max_limit             INT, -- NULL = no default, must be set

    -- Day availability: Array of day numbers (0=Sunday, 1=Monday, .. ., 6=Saturday)
    -- Example: ARRAY[0,1,2,3,4] = Sunday to Thursday only (no Friday/Saturday)
    -- Example: ARRAY[0,1,2,3,4,5,6] = All days
    available_days        INT[] DEFAULT ARRAY[0, 1, 2, 3, 4, 5, 6],

    is_active             BOOLEAN   DEFAULT TRUE,
    created_by            INT,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (site_id) REFERENCES site_info (site_id),
    FOREIGN KEY (created_by) REFERENCES users (id),
    UNIQUE (site_id, slot_id)
);

-- 5. site_info TICKET ALLOCATION TABLE
CREATE TABLE site_ticket_allocation
(
    id                    SERIAL PRIMARY KEY,
    site_id               VARCHAR(25) NOT NULL,
    allocation_date       DATE        NOT NULL,

    start_number          INT         NOT NULL,
    next_available_number INT         NOT NULL,

    is_active             BOOLEAN   DEFAULT TRUE,
    created_by            INT,
    created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (site_id) REFERENCES site_info (site_id),
    FOREIGN KEY (created_by) REFERENCES users (id),
    UNIQUE (site_id, allocation_date)
);

-- 6.  APPOINTMENT TABLE
CREATE TABLE appointment
(
    id                              SERIAL PRIMARY KEY,
    site_id                         VARCHAR(25)  NOT NULL,
    appointment_date                DATE         NOT NULL,
    slot_id                         INT          NOT NULL,

    -- Ticket number (sequential: 5000, 5001, 5002, etc.)
    appointment_number              INT          NOT NULL UNIQUE,

    appointment_time                TIME         NOT NULL,
    appointment_type                VARCHAR(50), -- 'bahraini' or 'non_bahraini'

    -- Contact information
    phone_number                    VARCHAR(20)  NOT NULL,
    email                           VARCHAR(255) NOT NULL,

    -- Status: pending / attended / not_attended / cancelled
    status                          VARCHAR(50)  NOT NULL DEFAULT 'pending',

    -- Status reason (for cancellations/rejections/not_attended)
    status_reason                   VARCHAR(500),

    -- Timing information
    ticket_printed_at               TIMESTAMP,

    -- Employee information
    employee_id                     INT,

    -- Rescheduling
    is_rescheduled                  BOOLEAN               DEFAULT FALSE,
    rescheduled_from_appointment_id INT,

    -- Activity tracking
    is_active                       BOOLEAN      NOT NULL DEFAULT TRUE,
    created_by                      INT,
    created_at                      TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    updated_at                      TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (site_id) REFERENCES site_info (site_id),
    FOREIGN KEY (slot_id) REFERENCES site_time_slot (id),
    FOREIGN KEY (employee_id) REFERENCES users (id),
    FOREIGN KEY (created_by) REFERENCES users (id),
    FOREIGN KEY (rescheduled_from_appointment_id) REFERENCES appointment (id)
);

-- 7. APPOINTMENT BAHRAINI
CREATE TABLE appointment_bahraini
(
    id                     SERIAL PRIMARY KEY,
    appointment_id         INT         NOT NULL UNIQUE,

    cpr_or_passport_number VARCHAR(25) NOT NULL,
    phone          VARCHAR(20),
    email                  VARCHAR(255),
    dependents_cpr         VARCHAR(25)[] DEFAULT ARRAY[]::VARCHAR[],
    cpr_count              INT                  DEFAULT 0,
    notes                  VARCHAR(500),
    is_active              BOOLEAN     NOT NULL DEFAULT TRUE,
    created_by             INT,
    created_at             TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at             TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    is_portal               boolean              DEFAULT FALSE,
    FOREIGN KEY (appointment_id) REFERENCES appointment (id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users (id)
);

-- 8. CLEARING AGENT APPOINTMENT
CREATE TABLE clearing_agent_appointment
(
    id                    SERIAL PRIMARY KEY,
    appointment_id        INT          NOT NULL UNIQUE,

    agent_name            VARCHAR(100) NOT NULL,
    agent_cpr_number      VARCHAR(25)  NOT NULL,
    agent_cr_number       VARCHAR(100) NOT NULL,

    agent_phone           VARCHAR(20),
    agent_email           VARCHAR(255),
    applicant_cpr_numbers VARCHAR(25)[] DEFAULT ARRAY[]::VARCHAR[],
    applicant_cpr_count   INT                   DEFAULT 0,

    notes                 VARCHAR(500),

    is_active             BOOLEAN      NOT NULL DEFAULT TRUE,
    created_by            INT,
    created_at            TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    is_portal               boolean              DEFAULT FALSE,

    FOREIGN KEY (appointment_id) REFERENCES appointment (id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users (id)
);

-- 9. BLOCK TABLE
CREATE TABLE block
(
    id                        SERIAL PRIMARY KEY,

    block_type                VARCHAR(50) NOT NULL, -- 'customer_no_show' or 'time_period'

    -- For customer no-shows
    cpr_or_passport_number    VARCHAR(25) NOT NULL,
    no_show_count             INT NOT NULL DEFAULT 0,

    -- For period-based blocks
    block_start_date          DATE NOT NULL,
    block_end_date            DATE NOT NULL,
    block_reason              VARCHAR(500),

    -- For time blocks
    site_id                   VARCHAR(25) NOT NULL ,
    block_date                DATE NOT NULL,
    start_time                TIME NOT NULL,
    end_time                  TIME NOT NULL,

    is_active                 BOOLEAN     NOT NULL DEFAULT TRUE,
    blocked_by_appointment_id INT,
    created_by                INT         NOT NULL,
    created_at                TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at                TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (site_id) REFERENCES site_info (site_id),
    FOREIGN KEY (blocked_by_appointment_id) REFERENCES appointment (id),
    FOREIGN KEY (created_by) REFERENCES users (id)
);

-- 10. HOLIDAY TABLE
CREATE TABLE holiday
(
    id                  SERIAL PRIMARY KEY,
    holiday_name        VARCHAR(255) NOT NULL,
    start_holiday_date  DATE         NOT NULL,
    end_holiday_date    DATE         NOT NULL,
    holiday_description VARCHAR(500),
    reminder_before     INT,

    is_active           BOOLEAN      NOT NULL DEFAULT TRUE,
    created_by          INT          NOT NULL,
    created_at          TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP             DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by) REFERENCES users (id)
);

-- 11. site_info HOLIDAY TABLE
CREATE TABLE site_holiday
(
    id         SERIAL PRIMARY KEY,
    site_id    VARCHAR(25) NOT NULL,
    holiday_id INT         NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (site_id) REFERENCES site_info (site_id),
    FOREIGN KEY (holiday_id) REFERENCES holiday (id) ON DELETE CASCADE,
    UNIQUE (site_id, holiday_id)
);

-- 12. ACTION LOG TABLE
CREATE TABLE log
(
    id                 SERIAL PRIMARY KEY,
    user_id            INT          NOT NULL,
    action_type        VARCHAR(100) NOT NULL,

    appointment_id     INT,
    cpr_or_passport_number    VARCHAR(25),
    site_id            VARCHAR(25),

    action_description VARCHAR(500),
    table_name         VARCHAR(100),
    old_value          VARCHAR(500),
    new_value          VARCHAR(500),

    ip_address         VARCHAR(255),
    user_agent         VARCHAR(500),

    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (appointment_id) REFERENCES appointment (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (appointment_id) REFERENCES appointment (id),
    FOREIGN KEY (site_id) REFERENCES site_info (site_id)
);

-- 13. APPOINTMENT RESCHEDULED LOG
CREATE TABLE appointment_rescheduled_log
(
    id                   SERIAL PRIMARY KEY,
    appointment_id       INT NOT NULL,

    old_appointment_date DATE,
    old_slot_id          INT,
    old_appointment_time TIME,

    new_appointment_date DATE,
    new_slot_id          INT,
    new_appointment_time TIME,

    rescheduled_by       INT NOT NULL,
    rescheduled_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id) REFERENCES appointment (id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointment (id) ON DELETE CASCADE,
    FOREIGN KEY (rescheduled_by) REFERENCES users (id)
);

-- 14. OPEN DAY LOG
-- tracks when the admin opens appointment booking for a specific date/branch.
-- It records the admin action of opening up slots for booking.
CREATE TABLE open_day_log
(
    id           SERIAL PRIMARY KEY,
    date_created DATE        NOT NULL,
    site_id      VARCHAR(25) NOT NULL,
    open_date    DATE        NOT NULL,

    created_by   INT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (site_id) REFERENCES site_info (site_id),
    FOREIGN KEY (created_by) REFERENCES users (id)
);

-- INDEXES

CREATE INDEX idx_users_role ON users (user_role_id);
CREATE INDEX idx_users_active ON users (is_active);
CREATE INDEX idx_site_info_active ON site_info (is_active);
CREATE INDEX idx_site_time_slot_site ON site_time_slot (site_id);
CREATE INDEX idx_appointment_site_date ON appointment (site_id, appointment_date);
CREATE INDEX idx_appointment_status ON appointment (status);
CREATE INDEX idx_appointment_employee ON appointment (employee_id);
CREATE INDEX idx_appointment_timing ON appointment (ticket_printed_at);
CREATE INDEX idx_bahraini_appointment ON appointment_bahraini (appointment_id);
CREATE INDEX idx_bahraini_cpr ON appointment_bahraini (cpr_or_passport_number);
CREATE INDEX idx_clearing_appointment ON clearing_agent_appointment (appointment_id);
CREATE INDEX idx_clearing_agent_cpr ON clearing_agent_appointment (agent_cpr_number);
CREATE INDEX idx_block_cpr ON block (cpr_or_passport_number);
CREATE INDEX idx_block_type ON block (block_type);
CREATE INDEX idx_block_period ON block (block_start_date, block_end_date);
CREATE INDEX idx_holiday_dates ON holiday (start_holiday_date, end_holiday_date);
CREATE INDEX idx_holiday_active ON holiday (is_active);
CREATE INDEX idx_site_holiday ON site_holiday (site_id);
CREATE INDEX idx_log_user ON log (user_id, created_at);
CREATE INDEX idx_log_appointment ON log (appointment_id);

--
-- -- SAMPLE DATA
--
-- INSERT INTO user_role (role_name)
-- VALUES ('Admin'),
--        ('Supervisor'),
--        ('Employee');
--
-- INSERT INTO site_info (site_id, site_name, description, start_time, end_time, ticket_start_number, ticket_max_number, is_non_bahraini,
--                        is_active)
-- VALUES ('ISA_TOWN', 'Isa Town', 'Main site_info', '08:00:00', '14:00:00', 5000, 5999, FALSE, TRUE),
--        ('MANAMA', 'Manama', 'Manama site_info', '08:00:00', '14:00:00', 7000, 7999, FALSE, TRUE),
--        ('MUHARRAQ', 'Muharraq', 'Muharraq site_info', '08:00:00', '14:00:00', 6000, 6999, FALSE, TRUE),
--        ('NON_BAH_1', 'Non-Bahraini', 'For Non-Bahraini', '08:00:00', '14:00:00', 8000, 8999, TRUE, TRUE);
--
-- -- Regular slots (Sunday-Thursday only, no Friday/Saturday)
-- INSERT INTO site_time_slot (site_id, slot_id, start_time, end_time, max_limit, available_days, is_active)
-- VALUES ('ISA_TOWN', 1, '08:00:00', '09:00:00', 10, ARRAY[0, 1, 2, 3, 4], TRUE),
--        ('ISA_TOWN', 2, '09:00:00', '10:00:00', 10, ARRAY[0, 1, 2, 3, 4], TRUE),
--        ('ISA_TOWN', 3, '10:00:00', '11:00:00', 10, ARRAY[0, 1, 2, 3, 4], TRUE),
--        ('ISA_TOWN', 4, '11:00:00', '12:00:00', 10, ARRAY[0, 1, 2, 3, 4], TRUE),
--        ('ISA_TOWN', 5, '12:00:00', '13:00:00', 10, ARRAY[0, 1, 2, 3, 4], TRUE),
--        ('ISA_TOWN', 6, '13:00:00', '14:00:00', 10, ARRAY[0, 1, 2, 3, 4], TRUE);
--
-- -- Admin-only slots (all days including Friday/Saturday)
-- INSERT INTO site_time_slot (site_id, slot_id, start_time, end_time, max_limit, available_days, is_active)
-- VALUES ('ISA_TOWN', 7, '08:00:00', '09:00:00', 10, ARRAY[0, 1, 2, 3, 4, 5, 6], TRUE),
--        ('ISA_TOWN', 8, '09:00:00', '10:00:00', 10, ARRAY[0, 1, 2, 3, 4, 5, 6], TRUE);
--
-- INSERT INTO site_ticket_allocation (site_id, allocation_date, start_number, next_available_number, is_active)
-- VALUES ('ISA_TOWN', '2025-11-27', 5000, 5000, TRUE),
--        ('MANAMA', '2025-11-27', 7000, 7000, TRUE),
--        ('MUHARRAQ', '2025-11-27', 6000, 6000, TRUE),
--        ('NON_BAH_1', '2025-11-27', 8000, 8000, TRUE);
--
-- -- HELPER FUNCTIONS
--
-- -- Check if slot is available on a specific day of week
-- CREATE
-- OR REPLACE FUNCTION is_slot_available_on_day(
--     p_slot_id INT,
--     p_site_id VARCHAR,
--     p_date DATE
-- )
-- RETURNS BOOLEAN AS $$
-- DECLARE
-- v_day_of_week INT;
--     v_available_days
-- INT[];
-- BEGIN
--     v_day_of_week
-- := EXTRACT(DOW FROM p_date)::INT;  -- 0=Sunday, 1=Monday, ..., 6=Saturday
--
-- SELECT available_days
-- INTO v_available_days
-- FROM site_time_slot
-- WHERE id = p_slot_id
--   AND site_id = p_site_id;
--
-- -- Check if day is in the available_days array
-- RETURN v_day_of_week = ANY (v_available_days);
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Get day name from day of week
-- CREATE
-- OR REPLACE FUNCTION get_day_name(p_day_of_week INT)
-- RETURNS VARCHAR AS $$
-- BEGIN
-- RETURN CASE p_day_of_week
--            WHEN 0 THEN 'Sunday'
--            WHEN 1 THEN 'Monday'
--            WHEN 2 THEN 'Tuesday'
--            WHEN 3 THEN 'Wednesday'
--            WHEN 4 THEN 'Thursday'
--            WHEN 5 THEN 'Friday'
--            WHEN 6 THEN 'Saturday'
--     END;
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Check if customer is late (45+ minutes)
-- CREATE
-- OR REPLACE FUNCTION is_customer_late(
--     p_appointment_id INT
-- )
-- RETURNS BOOLEAN AS $$
-- DECLARE
-- v_appointment_time TIME;
--     v_ticket_printed_at
-- TIMESTAMP;
--     v_minutes_late
-- INT;
-- BEGIN
-- SELECT a.appointment_time, a.ticket_printed_at
-- INTO v_appointment_time, v_ticket_printed_at
-- FROM appointment a
-- WHERE a.id = p_appointment_id;
--
-- IF
-- v_ticket_printed_at IS NULL THEN
--         RETURN FALSE;
-- END IF;
--
--     v_minutes_late
-- := EXTRACT(EPOCH FROM (v_ticket_printed_at -
--                    (DATE(v_ticket_printed_at)::timestamp + v_appointment_time))) / 60;
--
-- RETURN v_minutes_late >= 45;
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Get waiting time in minutes for an appointment
-- -- Note: This function requires service_started_at column to be added to appointment table
-- -- Currently returns 0 as placeholder
-- CREATE
-- OR REPLACE FUNCTION get_waiting_time_minutes(
--     p_appointment_id INT
-- )
-- RETURNS INT AS $$
-- BEGIN
--     -- TODO: Add service_started_at column to appointment table if needed
--     RETURN 0;
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Get average waiting time per site_info per day
-- -- Note: This function requires service_started_at column to be added to appointment table
-- -- Currently returns 0 as placeholder
-- CREATE
-- OR REPLACE FUNCTION get_site_info_avg_waiting_time(
--     p_site_id VARCHAR,
--     p_date DATE
-- )
-- RETURNS TABLE (
--     site_id VARCHAR,
--     appointment_date DATE,
--     avg_waiting_minutes NUMERIC,
--     total_appointments INT
-- ) AS $$
-- BEGIN
-- RETURN QUERY
-- SELECT a.site_id,
--        a.appointment_date,
--        0::NUMERIC as avg_waiting_minutes,
--        COUNT(a.id) ::INT
-- FROM appointment a
-- WHERE a.site_id = p_site_id
--   AND a.appointment_date = p_date
--   AND a.ticket_printed_at IS NOT NULL
-- GROUP BY a.site_id, a.appointment_date;
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Check if customer is blocked
-- CREATE
-- OR REPLACE FUNCTION is_customer_blocked(
--     p_cpr_or_passport VARCHAR,
--     p_booking_date DATE DEFAULT NULL
-- )
-- RETURNS BOOLEAN AS $$
-- BEGIN
--     -- Check no-show blocks (3+ no-shows)
--     IF
-- EXISTS(
--         SELECT 1 FROM block
--         WHERE cpr_or_passport_number = p_cpr_or_passport
--         AND block_type = 'customer_no_show'
--         AND no_show_count >= 3
--         AND is_active = TRUE
--     ) THEN
--         RETURN TRUE;
-- END IF;
--
--     -- Check period-based blocks
--     IF
-- p_booking_date IS NOT NULL THEN
--         IF EXISTS(
--             SELECT 1 FROM block
--             WHERE block_type = 'time_period'
--             AND p_booking_date BETWEEN block_start_date AND block_end_date
--             AND is_active = TRUE
--         ) THEN
--             RETURN TRUE;
-- END IF;
-- END IF;
--
-- RETURN FALSE;
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Check if date is holiday
-- CREATE
-- OR REPLACE FUNCTION is_date_holiday(
--     p_site_id VARCHAR,
--     p_date DATE
-- )
-- RETURNS BOOLEAN AS $$
-- BEGIN
-- RETURN EXISTS(SELECT 1
--               FROM site_holiday bh
--                        JOIN holiday h ON bh.holiday_id = h.id
--               WHERE bh.site_id = p_site_id
--                 AND p_date BETWEEN h.start_holiday_date AND h.end_holiday_date
--                 AND h.is_active = TRUE);
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Mark appointment as not attended and increment no-show count
-- CREATE
-- OR REPLACE FUNCTION mark_appointment_not_attended(
--     p_appointment_id INT,
--     p_cpr_or_passport VARCHAR,
--     p_marked_by INT,
--     p_reason VARCHAR DEFAULT NULL
-- )
-- RETURNS VOID AS $$
-- DECLARE
-- v_no_show_count INT;
-- BEGIN
-- UPDATE appointment
-- SET status        = 'not_attended',
--     status_reason = p_reason,
--     updated_at    = CURRENT_TIMESTAMP
-- WHERE id = p_appointment_id;
--
-- INSERT INTO log (user_id, action_type, appointment_id, cpr_or_passport, action_description)
-- VALUES (p_marked_by, 'marked_not_attended', p_appointment_id, p_cpr_or_passport,
--         'Marked appointment as not attended.  Reason: ' || COALESCE(p_reason, 'No reason provided'));
--
-- SELECT COALESCE(no_show_count, 0)
-- INTO v_no_show_count
-- FROM block
-- WHERE cpr_or_passport_number = p_cpr_or_passport
--   AND block_type = 'customer_no_show'
--   AND is_active = TRUE;
--
-- IF
-- v_no_show_count = 0 THEN
--         INSERT INTO block (
--             block_type, cpr_or_passport_number, no_show_count,
--             blocked_by_appointment_id, is_active, created_by
--         ) VALUES ('customer_no_show', p_cpr_or_passport, 1, p_appointment_id, TRUE, p_marked_by);
-- ELSE
-- UPDATE block
-- SET no_show_count = no_show_count + 1,
--     is_active     = CASE WHEN (no_show_count + 1) >= 3 THEN TRUE ELSE is_active END,
--     updated_at    = CURRENT_TIMESTAMP
-- WHERE cpr_or_passport_number = p_cpr_or_passport
--   AND block_type = 'customer_no_show';
-- END IF;
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Mark appointment as attended
-- CREATE
-- OR REPLACE FUNCTION mark_appointment_attended(
--     p_appointment_id INT,
--     p_marked_by INT
-- )
-- RETURNS VOID AS $$
-- BEGIN
-- UPDATE appointment
-- SET status     = 'attended',
--     updated_at = CURRENT_TIMESTAMP
-- WHERE id = p_appointment_id;
--
-- INSERT INTO log (user_id, action_type, appointment_id, action_description)
-- VALUES (p_marked_by, 'marked_attended', p_appointment_id, 'Marked appointment as attended');
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Cancel appointment
-- CREATE
-- OR REPLACE FUNCTION cancel_appointment(
--     p_appointment_id INT,
--     p_cancelled_by INT,
--     p_reason VARCHAR,
--     p_is_holiday_related BOOLEAN DEFAULT FALSE
-- )
-- RETURNS VOID AS $$
-- BEGIN
-- UPDATE appointment
-- SET status        = 'cancelled',
--     status_reason = p_reason,
--     updated_at    = CURRENT_TIMESTAMP
-- WHERE id = p_appointment_id;
--
-- INSERT INTO log (user_id, action_type, appointment_id, action_description)
-- VALUES (p_cancelled_by, 'cancelled_appointment', p_appointment_id,
--         'Cancelled appointment. Reason: ' || p_reason || '. Holiday-related: ' || p_is_holiday_related);
-- END;
-- $$
-- LANGUAGE plpgsql;
--
-- -- Allocate next ticket number
-- CREATE
-- OR REPLACE FUNCTION allocate_next_ticket(
--     p_site_id VARCHAR,
--     p_appointment_date DATE
-- )
-- RETURNS INT AS $$
-- DECLARE
-- v_next_number INT;
-- BEGIN
-- SELECT next_available_number
-- INTO v_next_number
-- FROM site_ticket_allocation
-- WHERE site_id = p_site_id
--   AND allocation_date = p_appointment_date
--     FOR UPDATE;
--
-- IF
-- v_next_number IS NULL THEN
--         RAISE EXCEPTION 'No ticket allocation found for site % on %', p_site_id, p_appointment_date;
-- END IF;
--
-- UPDATE site_ticket_allocation
-- SET next_available_number = next_available_number + 1,
--     updated_at            = CURRENT_TIMESTAMP
-- WHERE site_id = p_site_id
--   AND allocation_date = p_appointment_date;
--
-- RETURN v_next_number;
-- END;
-- $$
-- LANGUAGE plsql;

-- END OF SCHEMA