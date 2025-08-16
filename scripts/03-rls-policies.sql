-- Enable Row Level Security on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE discipline_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE merit_awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create function to get current user's school_id
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT school_id 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schools policies
CREATE POLICY "Users can view their own school" ON schools
  FOR SELECT USING (
    id = get_user_school_id() OR is_admin()
  );

CREATE POLICY "Admins can manage schools" ON schools
  FOR ALL USING (is_admin());

-- Users policies
CREATE POLICY "Users can view users in their school" ON users
  FOR SELECT USING (
    school_id = get_user_school_id() OR is_admin() OR id = auth.uid()
  );

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage users" ON users
  FOR ALL USING (is_admin());

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

-- Classes policies
CREATE POLICY "Users can view classes in their school" ON classes
  FOR SELECT USING (
    school_id = get_user_school_id() OR is_admin()
  );

CREATE POLICY "Teachers and admins can manage classes" ON classes
  FOR ALL USING (
    is_admin() OR 
    (SELECT role IN ('admin', 'teacher') FROM users WHERE id = auth.uid())
  );

-- Subjects policies
CREATE POLICY "Users can view subjects in their school" ON subjects
  FOR SELECT USING (
    school_id = get_user_school_id() OR is_admin()
  );

CREATE POLICY "Teachers and admins can manage subjects" ON subjects
  FOR ALL USING (
    is_admin() OR 
    (SELECT role IN ('admin', 'teacher') FROM users WHERE id = auth.uid())
  );

-- Students policies
CREATE POLICY "Users can view students in their school" ON students
  FOR SELECT USING (
    school_id = get_user_school_id() OR 
    is_admin() OR
    parent_id = auth.uid() OR
    user_id = auth.uid()
  );

CREATE POLICY "Teachers and admins can manage students" ON students
  FOR ALL USING (
    is_admin() OR 
    (SELECT role IN ('admin', 'teacher') FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Parents can view their children" ON students
  FOR SELECT USING (parent_id = auth.uid());

-- Grades policies
CREATE POLICY "Users can view grades for students in their school" ON grades
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = grades.student_id 
      AND (s.school_id = get_user_school_id() OR s.parent_id = auth.uid() OR s.user_id = auth.uid())
    ) OR is_admin()
  );

CREATE POLICY "Teachers and admins can manage grades" ON grades
  FOR ALL USING (
    is_admin() OR 
    (SELECT role IN ('admin', 'teacher') FROM users WHERE id = auth.uid())
  );

-- Attendance policies
CREATE POLICY "Users can view attendance for students in their school" ON attendance
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = attendance.student_id 
      AND (s.school_id = get_user_school_id() OR s.parent_id = auth.uid() OR s.user_id = auth.uid())
    ) OR is_admin()
  );

CREATE POLICY "Teachers and admins can manage attendance" ON attendance
  FOR ALL USING (
    is_admin() OR 
    (SELECT role IN ('admin', 'teacher') FROM users WHERE id = auth.uid())
  );

-- Discipline records policies
CREATE POLICY "Users can view discipline records for students in their school" ON discipline_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = discipline_records.student_id 
      AND (s.school_id = get_user_school_id() OR s.parent_id = auth.uid() OR s.user_id = auth.uid())
    ) OR is_admin()
  );

CREATE POLICY "Teachers and admins can manage discipline records" ON discipline_records
  FOR ALL USING (
    is_admin() OR 
    (SELECT role IN ('admin', 'teacher') FROM users WHERE id = auth.uid())
  );

-- Merit awards policies
CREATE POLICY "Users can view merit awards for students in their school" ON merit_awards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = merit_awards.student_id 
      AND (s.school_id = get_user_school_id() OR s.parent_id = auth.uid() OR s.user_id = auth.uid())
    ) OR is_admin()
  );

CREATE POLICY "Teachers and admins can manage merit awards" ON merit_awards
  FOR ALL USING (
    is_admin() OR 
    (SELECT role IN ('admin', 'teacher') FROM users WHERE id = auth.uid())
  );

-- Payments policies
CREATE POLICY "Users can view payments for students in their school" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = payments.student_id 
      AND (s.school_id = get_user_school_id() OR s.parent_id = auth.uid() OR s.user_id = auth.uid())
    ) OR is_admin()
  );

CREATE POLICY "Admins can manage payments" ON payments
  FOR ALL USING (is_admin());

CREATE POLICY "Parents can view their children's payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students s 
      WHERE s.id = payments.student_id AND s.parent_id = auth.uid()
    )
  );
