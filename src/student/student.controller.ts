import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('student')
@Controller('student')
export class StudentController {
	constructor(private readonly studentService: StudentService) { }

	@Post()
	create(@Body() createStudentDto: CreateStudentDto) {
		return this.studentService.create(createStudentDto);
	}

	@Get()
	findAll() {
		return this.studentService.findAll();
	}

	@Get('/detail/:id')
	findOne(@Param('id') id: string) {
		return this.studentService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateStudentDto: UpdateStudentDto,
	) {
		return this.studentService.update(+id, updateStudentDto).then((res) => {
			return res.affected > 0 ? 'success' : 'fail';
		});
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.studentService.remove(+id).then((res) => {
			return res.affected > 0 ? 'success' : 'fail';
		});
	}
}
