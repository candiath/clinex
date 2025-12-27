import { MySQLDatabase } from '../../data/mysql/mysql.init';
import { TestDatabaseHelper } from '../helpers/testDatabase.helper';

/**
 * Database Schema Validation Tests
 * 
 * CRITICAL: These tests ensure the database schema matches expectations
 * Prevents runtime errors like "Table doesn't exist" or "Column missing"
 * 
 * TODO: Run these tests in CI/CD to catch schema mismatches before deployment
 */
describe('Database Schema Validation', () => {
  
  beforeAll(async () => {
    await TestDatabaseHelper.connect();
  });

  afterAll(async () => {
    await TestDatabaseHelper.disconnect();
  });

  describe('Table Existence', () => {
    it('should have patients table', async () => {
      const [rows] = await MySQLDatabase.pool.execute(
        "SHOW TABLES LIKE 'patients'"
      );
      
      expect((rows as any[]).length).toBe(1);
    });

    it('should have doctors table', async () => {
      const [rows] = await MySQLDatabase.pool.execute(
        "SHOW TABLES LIKE 'doctors'"
      );
      
      expect((rows as any[]).length).toBe(1);
    });
  });

  describe('Patients Table Schema', () => {
    let columns: any[];

    beforeAll(async () => {
      const [rows] = await MySQLDatabase.pool.execute(
        "DESCRIBE patients"
      );
      columns = rows as any[];
    });

    it('should have all required columns', () => {
      const columnNames = columns.map(col => col.Field);
      
      const requiredColumns = [
        'id',
        'dni',
        'first_name',
        'last_name',
        'birth_date',
        'email',
        'sex',
        'is_active',
        'created_at',
        'updated_at'
      ];

      requiredColumns.forEach(requiredCol => {
        expect(columnNames).toContain(requiredCol);
      });
    });

    it('should have correct primary key', () => {
      const idColumn = columns.find(col => col.Field === 'id');
      
      expect(idColumn).toBeDefined();
      expect(idColumn.Key).toBe('PRI');
      expect(idColumn.Extra).toContain('auto_increment');
    });

    it('should have unique constraint on dni', () => {
      const dniColumn = columns.find(col => col.Field === 'dni');
      
      expect(dniColumn).toBeDefined();
      expect(dniColumn.Key).toBe('UNI');
      expect(dniColumn.Null).toBe('NO');
    });

    it('should have correct data types', () => {
      const idColumn = columns.find(col => col.Field === 'id');
      const dniColumn = columns.find(col => col.Field === 'dni');
      const birthDateColumn = columns.find(col => col.Field === 'birth_date');
      const sexColumn = columns.find(col => col.Field === 'sex');
      const isActiveColumn = columns.find(col => col.Field === 'is_active');

      expect(idColumn.Type).toBe('int');
      expect(dniColumn.Type).toBe('varchar(20)');
      expect(birthDateColumn.Type).toBe('date');
      expect(sexColumn.Type).toContain('enum');
      expect(isActiveColumn.Type).toBe('tinyint(1)'); //? BOOLEAN is stored as tinyint(1)
    });

    it('should have correct NOT NULL constraints', () => {
      const requiredColumns = ['dni', 'first_name', 'last_name', 'birth_date', 'sex'];
      
      requiredColumns.forEach(colName => {
        const column = columns.find(col => col.Field === colName);
        expect(column.Null).toBe('NO');
      });
    });

    it('should have default values where expected', () => {
      const isActiveColumn = columns.find(col => col.Field === 'is_active');
      
      expect(isActiveColumn.Default).toBe('1'); //? TRUE is represented as 1
    });
  });

  describe('Doctors Table Schema', () => {
    let columns: any[];

    beforeAll(async () => {
      const [rows] = await MySQLDatabase.pool.execute(
        "DESCRIBE doctors"
      );
      columns = rows as any[];
    });

    it('should have all required columns', () => {
      const columnNames = columns.map(col => col.Field);
      
      const requiredColumns = [
        'id',
        'name',
        'specialty',
        'email',
        'phone',
        'is_active',
        'created_at',
        'updated_at'
      ];

      requiredColumns.forEach(requiredCol => {
        expect(columnNames).toContain(requiredCol);
      });
    });

    it('should have unique constraint on email', () => {
      const emailColumn = columns.find(col => col.Field === 'email');
      
      expect(emailColumn).toBeDefined();
      expect(emailColumn.Key).toBe('UNI');
      expect(emailColumn.Null).toBe('NO');
    });

    it('should have ENUM type for specialty with correct values', () => {
      const specialtyColumn = columns.find(col => col.Field === 'specialty');
      
      expect(specialtyColumn).toBeDefined();
      expect(specialtyColumn.Type).toContain('enum');
      
      const expectedSpecialties = [
        'CARDIOLOGY',
        'DERMATOLOGY',
        'NEUROLOGY',
        'PEDIATRICS',
        'PSYCHIATRY',
        'RADIOLOGY',
        'SURGERY',
        'INTERNAL_MEDICINE',
        'EMERGENCY_MEDICINE',
        'ANESTHESIOLOGY'
      ];

      const enumType = specialtyColumn.Type;
      expectedSpecialties.forEach(specialty => {
        expect(enumType).toContain(specialty);
      });
    });
  });

  describe('Indexes Verification', () => {
    it('should have indexes on patients table', async () => {
      const [rows] = await MySQLDatabase.pool.execute(
        "SHOW INDEX FROM patients"
      );
      
      const indexes = (rows as any[]).map(idx => idx.Key_name);
      
      expect(indexes).toContain('PRIMARY');
      expect(indexes).toContain('dni');
      expect(indexes).toContain('idx_patient_dni');
      expect(indexes).toContain('idx_patient_email');
      expect(indexes).toContain('idx_patient_active');
    });

    it('should have indexes on doctors table', async () => {
      const [rows] = await MySQLDatabase.pool.execute(
        "SHOW INDEX FROM doctors"
      );
      
      const indexes = (rows as any[]).map(idx => idx.Key_name);
      
      expect(indexes).toContain('PRIMARY');
      expect(indexes).toContain('email');  //? UNIQUE constraint creates an index
      expect(indexes).toContain('idx_doctor_email');
      expect(indexes).toContain('idx_doctor_specialty');
      expect(indexes).toContain('idx_doctor_active');
    });
  });

  describe('Schema Consistency Check', () => {
    it('should match the migration files expectations', async () => {
      
      const [patientRows] = await MySQLDatabase.pool.execute(
        "SHOW TABLES LIKE 'patients'"
      );
      const [doctorRows] = await MySQLDatabase.pool.execute(
        "SHOW TABLES LIKE 'doctors'"
      );
      
      expect((patientRows as any[]).length).toBe(1);
      expect((doctorRows as any[]).length).toBe(1);

      // Verify both tables can be queried (this would fail if schema is broken)
      await expect(
        MySQLDatabase.pool.execute("SELECT COUNT(*) FROM patients")
      ).resolves.toBeDefined();
      
      await expect(
        MySQLDatabase.pool.execute("SELECT COUNT(*) FROM doctors")
      ).resolves.toBeDefined();
    });
  });
});
