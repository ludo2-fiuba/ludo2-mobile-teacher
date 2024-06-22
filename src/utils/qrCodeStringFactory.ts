// these types must be synced with LUDO
enum QRCodeType {
    FinalExamUuid = 'FinalExamUuid',
    AttendanceUuid = 'AttendanceUuid',
    EvaluationUuid = 'EvaluationUuid',
}

export function getQrAttendanceStringFromQrId(qrId: string): string {
    return `ludo:${QRCodeType.AttendanceUuid}:${qrId}`
}
