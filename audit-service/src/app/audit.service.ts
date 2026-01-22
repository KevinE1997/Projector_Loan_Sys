import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { UpdateAuditDto } from './dto/update-audit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './audit/schemas/audit-log.schema';



@Injectable()
export class AuditService {
  constructor(@InjectModel(AuditLog.name) private auditModel: Model<AuditLog>) {}
 
  async logEvent(event: string, data: any) {
    console.log(`🕵️ AUDIT: Registrando evento [${event}]`);
    const newLog = new this.auditModel({
      event,
      data,
      source: 'kafka',
    });
    return newLog.save();
  }

  create(createAuditDto: CreateAuditDto) {
    return 'This action adds a new audit';
  }

  findAll() {
    return `This action returns all audit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} audit`;
  }

  update(id: number, updateAuditDto: UpdateAuditDto) {
    return `This action updates a #${id} audit`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit`;
  }
}
