const MAX_TRAIN_NAME_LENGTH = 12;
const MIN_TRAIN_NAME_LENGTH = 3;

export function assureTrainNameValid(trainName: string) {
  trainName = trainName.trim().toLowerCase();

  if (trainName.length > MAX_TRAIN_NAME_LENGTH || trainName.length < MIN_TRAIN_NAME_LENGTH) {
    throw new Error(
      `Train name must be between ${MIN_TRAIN_NAME_LENGTH} and ${MAX_TRAIN_NAME_LENGTH} characters or more.`
    );
  }

  if (!/^[a-z1-5\.]+$/.test(trainName)) {
    throw new Error(`Train name must contain only\nthe letters a-z and the digits 1 to 5.`);
  }

  return trainName;
}
