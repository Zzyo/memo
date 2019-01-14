import watchRecord from './record';

export default function* rootSaga() {
  yield watchRecord();
}
