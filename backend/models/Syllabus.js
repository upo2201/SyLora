import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  chapters: [chapterSchema],
});

const syllabusSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  subjects: [subjectSchema],
}, { timestamps: true });

const Syllabus = mongoose.model('Syllabus', syllabusSchema);

export default Syllabus;
