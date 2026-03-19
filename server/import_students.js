const mongoose = require('mongoose');
const XLSX = require('xlsx');
const User = require('./models/User');
require('dotenv').config();

async function importStudents() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop the old unique email index if it exists
        try {
            await User.collection.dropIndex('email_1');
            console.log('Dropped old email index');
        } catch (e) {
            console.log('Email index does not exist or already dropped');
        }

        const workbook = XLSX.readFile('c:/Users/there/Downloads/SJCETstudent.xlsx');
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        let headerRowIndex = -1;
        for (let i = 0; i < data.length; i++) {
            if (data[i] && data[i].some(cell => typeof cell === 'string' && cell.toLowerCase().includes('register number'))) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) {
            console.error('Could not find header row with "Register Number"');
            process.exit(1);
        }

        const headers = data[headerRowIndex];
        const regIdx = 0;
        const nameIdx = 1;

        console.log(`Using columns: Reg=${regIdx} (${headers[regIdx]}), Name=${nameIdx} (${headers[nameIdx]})`);

        const students = [];
        for (let i = headerRowIndex + 1; i < data.length; i++) {
            const row = data[i];
            if (row[regIdx] && String(row[regIdx]).startsWith('SJC')) {
                students.push({
                    admissionNumber: String(row[regIdx]).trim(),
                    name: String(row[nameIdx] || 'Student').trim(),
                    password: '123456',
                    role: 'student'
                });
            }
        }

        console.log(`Found ${students.length} students. Importing...`);

        let successCount = 0;
        for (const student of students) {
            try {
                await User.findOneAndUpdate(
                    { admissionNumber: student.admissionNumber },
                    student,
                    { upsert: true, new: true }
                );
                successCount++;
            } catch (err) {
                console.error(`Failed to import student ${student.admissionNumber}:`, err.message);
            }
        }

        console.log(`Import completed. Success: ${successCount}, Failed: ${students.length - successCount}`);
        process.exit(0);

        console.log('Import successful!');
        process.exit(0);
    } catch (err) {
        console.error('Import failed:', err);
        process.exit(1);
    }
}

importStudents();
