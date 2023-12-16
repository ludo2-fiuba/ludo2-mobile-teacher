import { CreateEvaluation } from '../models/CreateEvaluation.ts';
import { Evaluation } from '../models/Evaluation.ts';
import { Semester } from '../models/Semester.ts';
import { post } from './authenticatedRepository.ts';

const domainUrl = 'api/teacher/evaluations';

async function create(semester: Semester, evaluationName: string, startDate: Date, finishDate: Date): Promise<CreateEvaluation> {
  const evaluationToBeCreated: CreateEvaluation = {
    semester_id: semester.id,
    evaluation_name: evaluationName,
    is_graded: true,
    passing_grade: 4,
    start_date: startDate,
    end_date: finishDate
  }

  return await post(`${domainUrl}/add_evaluation`, evaluationToBeCreated) as unknown as CreateEvaluation
}

// To implement when evaluations contain grades and the backend supports adding students to evaluations
async function addStudent(evaluationId: number, padron: string) {
  // const data: any = await post(`${domainUrl}/${evaluationId}/final_exams`, {
  //   padron: padron,
  // })

  // const studentData = data.student
  // const modifiedEvaluation = new FinalExam(
  //     data.id,
  //     evaluationId,
  //     new Student(
  //       studentData.padron,
  //       studentData.first_name,
  //       studentData.last_name,
  //       studentData.dni,
  //       studentData.email,
  //     ),
  //     data.grade,
  //     data.correlatives_approved,
  //   )
  // const modifiedEvaluation = data
}

export default { create, addStudent }
