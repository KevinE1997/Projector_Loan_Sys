import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @Inject('KAFKA_CLIENT') // <--- Inyectamos Kafka
    private readonly kafkaClient: ClientKafka,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    // 1. Guardar el feedback
    const newFeedback = this.feedbackRepository.create(createFeedbackDto);
    const savedFeedback = await this.feedbackRepository.save(newFeedback);

    // 2. Lógica Reactiva: Si el rating es malo (<= 2), avisar a mantenimiento
    if (savedFeedback.rating <= 2) {
      console.log('⚠️ Alerta: Equipo reportado en mal estado via Feedback');
      this.kafkaClient.emit('maintenance.alert', JSON.stringify({
        loanId: savedFeedback.loanId,
        reason: savedFeedback.comment || 'Calificación baja sin comentarios',
        severity: 'HIGH'
      }));
    }

    return savedFeedback;
  }

  findOne(id: string) {
    return this.feedbackRepository.findOneBy({ id });
  }

  update(id: string, updateFeedbackDto: any) {
    return this.feedbackRepository.update(id, updateFeedbackDto);
  }

  remove(id: string) {
    return this.feedbackRepository.delete(id);
  }


  findAll() {
    return this.feedbackRepository.find();
  }
}