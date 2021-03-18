import { ApiProperty } from "@nestjs/swagger";

export class CreateStudentDto {
	@ApiProperty({
        description: '姓',
    })
	firstName: string;
	@ApiProperty({
        description: '名',
    })
	lastName: string;
	@ApiProperty({
        description: '是否启用',
    })
	isActive: boolean;
}
