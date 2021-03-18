import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
	constructor(
		@InjectRepository(Student)
		private studentRepository: Repository<Student>,
	) {}
	create(data: CreateStudentDto) {
		return this.studentRepository.save(data);
	}

	findAll(): Promise<Student[]> {
		return this.studentRepository.find();
	}

	findOne(id: number): Promise<Student> {
		return this.studentRepository.findOne(id);
	}

	update(id: number, updateStudentDto: UpdateStudentDto) {
		return this.studentRepository.update(id, updateStudentDto);
	}

	remove(id: number) {
		return this.studentRepository.delete(id);
	}
}
