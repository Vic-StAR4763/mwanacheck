-- Insert sample school
INSERT INTO schools (id, name, address, phone, email, type) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Greenwood Secondary School', '123 Education Street, Nairobi, Kenya', '+254700000000', 'info@greenwood.edu.ke', 'secondary'),
('550e8400-e29b-41d4-a716-446655440001', 'Greenwood Elementary', '123 Oak Street, Springfield', '+1-555-0101', 'info@greenwood.edu', 'public'),
('550e8400-e29b-41d4-a716-446655440002', 'Riverside High School', '456 River Road, Springfield', '+1-555-0102', 'admin@riverside.edu', 'public'),
('550e8400-e29b-41d4-a716-446655440003', 'St. Mary''s Academy', '789 Church Lane, Springfield', '+1-555-0103', 'office@stmarys.edu', 'private');

-- Insert sample users
INSERT INTO users (id, school_id, name, email, phone, role, status) VALUES
-- Admin
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'John Admin', 'admin@greenwood.edu.ke', '+254700000001', 'admin', 'active'),
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'John Smith', 'john.smith@greenwood.edu', '+1-555-1001', 'admin', 'active'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah.johnson@riverside.edu', '+1-555-1002', 'admin', 'active'),

-- Teachers
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'Mary Johnson', 'mary.johnson@greenwood.edu.ke', '+254700000002', 'teacher', 'active'),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'David Wilson', 'david.wilson@greenwood.edu.ke', '+254700000003', 'teacher', 'active'),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'Sarah Brown', 'sarah.brown@greenwood.edu.ke', '+254700000004', 'teacher', 'active'),
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 'Emily Davis', 'emily.davis@greenwood.edu', '+1-555-2001', 'teacher', 'active'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440001', 'Michael Brown', 'michael.brown@greenwood.edu', '+1-555-2002', 'teacher', 'active'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440002', 'Lisa Wilson', 'lisa.wilson@riverside.edu', '+1-555-2003', 'teacher', 'active'),

-- Parents
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'Robert Smith', 'robert.smith@email.com', '+254700000005', 'parent', 'active'),
('550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440000', 'Linda Davis', 'linda.davis@email.com', '+254700000006', 'parent', 'active'),
('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440000', 'Michael Jones', 'michael.jones@email.com', '+254700000007', 'parent', 'active'),
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', 'Robert Miller', 'robert.miller@email.com', '+1-555-3001', 'parent', 'active'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'Jennifer Garcia', 'jennifer.garcia@email.com', '+1-555-3002', 'parent', 'active'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440002', 'David Martinez', 'david.martinez@email.com', '+1-555-3003', 'parent', 'active');

-- Insert sample classes
INSERT INTO classes (id, school_id, name, level, teacher_id) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'Form 1A', 1, '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'Form 2B', 2, '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'Form 3C', 3, '550e8400-e29b-41d4-a716-446655440004'),
('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440000', 'Form 4A', 4, '550e8400-e29b-41d4-a716-446655440002');

INSERT INTO classes (id, school_id, name, grade_level, teacher_id, capacity) VALUES
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440001', 'Grade 3A', '3rd Grade', '550e8400-e29b-41d4-a716-446655440020', 25),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440001', 'Grade 4B', '4th Grade', '550e8400-e29b-41d4-a716-446655440021', 28),
('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440002', 'Grade 9A', '9th Grade', '550e8400-e29b-41d4-a716-446655440022', 30);

-- Insert sample students
INSERT INTO students (id, school_id, user_id, parent_id, class_id, admission_number, name, email, phone, date_of_birth, gender, address, gpa, discipline_points, status) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', NULL, '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440010', 'GWS001', 'Alice Smith', 'alice.smith@student.greenwood.edu.ke', '+254700000020', '2008-03-15', 'female', 'Nairobi, Kenya', 3.75, 85, 'active'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440000', NULL, '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440011', 'GWS002', 'Bob Davis', 'bob.davis@student.greenwood.edu.ke', '+254700000021', '2007-07-22', 'male', 'Nairobi, Kenya', 3.20, 75, 'active'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440000', NULL, '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440012', 'GWS003', 'Carol Jones', 'carol.jones@student.greenwood.edu.ke', '+254700000022', '2006-11-08', 'female', 'Nairobi, Kenya', 3.90, 90, 'active'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440000', NULL, '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440013', 'GWS004', 'Daniel Smith', 'daniel.smith@student.greenwood.edu.ke', '+254700000023', '2005-05-12', 'male', 'Nairobi, Kenya', 3.45, 80, 'active');

INSERT INTO students (id, school_id, parent_id, class_id, admission_number, name, email, phone, date_of_birth, gender, address, gpa, discipline_points, status) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440040', 'GW2024001', 'Alex Miller', 'alex.miller@student.greenwood.edu', NULL, '2015-03-15', 'male', '123 Maple Street, Springfield', 3.75, 0, 'active'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440041', 'GW2024002', 'Sofia Garcia', 'sofia.garcia@student.greenwood.edu', NULL, '2014-07-22', 'female', '456 Pine Avenue, Springfield', 3.90, 5, 'active'),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440042', 'RH2024001', 'Carlos Martinez', 'carlos.martinez@student.riverside.edu', '+1-555-4001', '2009-11-08', 'male', '789 Cedar Road, Springfield', 3.25, 10, 'active'),
('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440040', 'GW2024003', 'Liam Miller', 'liam.miller@student.greenwood.edu', NULL, '2015-01-12', 'male', '123 Maple Street, Springfield', 3.50, 2, 'active'),
('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440042', 'RH2024002', 'Isabella Martinez', 'isabella.martinez@student.riverside.edu', '+1-555-4002', '2009-05-20', 'female', '789 Elm Drive, Springfield', 3.65, 1, 'active');

-- Insert sample subjects
INSERT INTO subjects (id, school_id, name, code, description) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440000', 'Mathematics', 'MATH', 'Core mathematics curriculum'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440000', 'English', 'ENG', 'English language and literature'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440000', 'Science', 'SCI', 'General science curriculum'),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440000', 'History', 'HIST', 'World and local history'),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440000', 'Geography', 'GEO', 'Physical and human geography');

INSERT INTO subjects (id, school_id, name, code, description) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440001', 'Mathematics', 'MATH', 'Elementary Mathematics'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440001', 'English Language Arts', 'ELA', 'Reading, Writing, and Literature'),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440001', 'Science', 'SCI', 'Elementary Science'),
('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440002', 'Algebra I', 'ALG1', 'High School Algebra'),
('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440002', 'Biology', 'BIO', 'High School Biology');

-- Insert sample grades
INSERT INTO grades (student_id, subject_id, teacher_id, term, year, score, grade, remarks) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440002', 'Term 1', 2024, 85.5, 'A', 'Excellent performance'),
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440003', 'Term 1', 2024, 78.0, 'B+', 'Good work'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440002', 'Term 1', 2024, 72.5, 'B', 'Satisfactory'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440003', 'Term 1', 2024, 68.0, 'B-', 'Needs improvement');

INSERT INTO grades (student_id, subject_id, teacher_id, grade, max_grade, assessment_type, assessment_date, comments) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440020', 92.5, 100.0, 'Test', '2024-01-15', 'Excellent work on fractions'),
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440020', 88.0, 100.0, 'Essay', '2024-01-20', 'Good creative writing skills'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440021', 78.5, 100.0, 'Test', '2024-01-15', 'Needs improvement in multiplication'),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440022', 95.0, 100.0, 'Quiz', '2024-01-18', 'Outstanding understanding of linear equations'),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440022', 91.5, 100.0, 'Lab Report', '2024-01-22', 'Excellent lab technique and analysis');

-- Insert sample attendance
INSERT INTO attendance (student_id, class_id, date, status, remarks) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '2024-01-15', 'present', NULL),
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '2024-01-16', 'present', NULL),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', '2024-01-15', 'absent', 'Sick'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440011', '2024-01-16', 'present', NULL);

INSERT INTO attendance (student_id, class_id, date, status, marked_by) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440040', '2024-01-15', 'present', '550e8400-e29b-41d4-a716-446655440020'),
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440040', '2024-01-16', 'present', '550e8400-e29b-41d4-a716-446655440020'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440041', '2024-01-15', 'late', '550e8400-e29b-41d4-a716-446655440021'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440041', '2024-01-16', 'absent', '550e8400-e29b-41d4-a716-446655440021'),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440042', '2024-01-15', 'present', '550e8400-e29b-41d4-a716-446655440022');

-- Insert sample discipline records
INSERT INTO discipline_records (student_id, teacher_id, incident_type, description, action_taken, points_deducted, date, status) VALUES
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440003', 'Late to class', 'Student arrived 15 minutes late to English class', 'Verbal warning given', 5, '2024-01-10', 'resolved'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440002', 'Incomplete homework', 'Failed to submit mathematics assignment', 'Extra assignment given', 10, '2024-01-12', 'resolved');

INSERT INTO discipline_records (student_id, reported_by, incident_type, description, action_taken, points_deducted, incident_date, status) VALUES
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440021', 'Disruption', 'Talking during class instruction', 'Verbal warning given', 5, '2024-01-10', 'resolved'),
('550e8400-e29b-41d4-a716-446655440052', '550e8400-e29b-41d4-a716-446655440022', 'Late to Class', 'Arrived 15 minutes late without excuse', 'Detention assigned', 10, '2024-01-12', 'resolved'),
('550e8400-e29b-41d4-a716-446655440053', '550e8400-e29b-41d4-a716-446655440020', 'Late Assignment', 'Math homework submitted 2 days late', 'Grade reduction applied', 2, '2024-01-12', 'resolved'),
('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440022', 'Minor Misconduct', 'Using phone during class', 'Phone confiscated for the day', 1, '2024-01-14', 'resolved');

-- Insert sample merit awards
INSERT INTO merit_awards (student_id, teacher_id, award_type, description, points_awarded, date) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440002', 'Academic Excellence', 'Top performer in mathematics test', 15, '2024-01-20'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440004', 'Leadership', 'Excellent class leadership skills', 10, '2024-01-18');

INSERT INTO merit_awards (student_id, awarded_by, award_type, description, points_awarded, award_date) VALUES
('550e8400-e29b-41d4-a716-446655440050', '550e8400-e29b-41d4-a716-446655440020', 'Academic Excellence', 'Perfect score on mathematics test', 10, '2024-01-15'),
('550e8400-e29b-41d4-a716-446655440054', '550e8400-e29b-41d4-a716-446655440022', 'Leadership', 'Helped organize school science fair', 15, '2024-01-20'),
('550e8400-e29b-41d4-a716-446655440051', '550e8400-e29b-41d4-a716-446655440021', 'Community Service', 'Volunteered at local food bank', 20, '2024-01-18');

-- Insert sample payments
INSERT INTO payments (student_id, amount, payment_type, description, due_date, paid_date, status) VALUES
('550e8400-e29b-41d4-a716-446655440020', 15000.00, 'tuition', 'Term 1 school fees', '2024-01-31', '2024-01-15', 'paid'),
('550e8400-e29b-41d4-a716-446655440021', 15000.00, 'tuition', 'Term 1 school fees', '2024-01-31', NULL, 'pending'),
('550e8400-e29b-41d4-a716-446655440022', 2000.00, 'transport', 'Monthly transport fee', '2024-02-01', '2024-01-25', 'paid'),
('550e8400-e29b-41d4-a716-446655440023', 15000.00, 'tuition', 'Term 1 school fees', '2024-01-31', '2024-01-10', 'paid');

INSERT INTO payments (student_id, amount, payment_type, description, payment_method, payment_date, due_date, status, reference_number) VALUES
('550e8400-e29b-41d4-a716-446655440050', 250.00, 'Tuition', 'Monthly tuition fee - January 2024', 'Credit Card', '2024-01-05', '2024-01-01', 'paid', 'PAY-2024-001'),
('550e8400-e29b-41d4-a716-446655440051', 250.00, 'Tuition', 'Monthly tuition fee - January 2024', 'Bank Transfer', '2024-01-03', '2024-01-01', 'paid', 'PAY-2024-002'),
('550e8400-e29b-41d4-a716-446655440052', 350.00, 'Tuition', 'Monthly tuition fee - January 2024', 'Check', '2024-01-02', '2024-01-01', 'paid', 'PAY-2024-003'),
('550e8400-e29b-41d4-a716-446655440053', 250.00, 'Tuition', 'Monthly tuition fee - February 2024', NULL, NULL, '2024-02-01', 'pending', 'PAY-2024-004'),
('550e8400-e29b-41d4-a716-446655440050', 50.00, 'Activity Fee', 'Science fair participation fee', 'Cash', '2024-01-20', '2024-01-15', 'paid', 'PAY-2024-005');
