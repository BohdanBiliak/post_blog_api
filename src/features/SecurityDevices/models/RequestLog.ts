
import { Schema, model, Document } from 'mongoose';

interface IRequestLog extends Document {
    IP: string;
    URL: string;
    date: Date;
}

const RequestLogSchema = new Schema<IRequestLog>({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true }
});

export default model<IRequestLog>('RequestLog', RequestLogSchema);
