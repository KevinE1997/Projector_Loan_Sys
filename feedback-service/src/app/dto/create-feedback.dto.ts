import { ApiProperty } from '@nestjs/swagger';

export class CreateFeedbackDto {
  @ApiProperty()
  loanId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  rating: number;

  @ApiProperty({ required: false })
  comment?: string;
}