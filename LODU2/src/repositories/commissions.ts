import {Commission, Subject} from '../models';
import {get} from './authenticatedRepository.ts';

const domainUrl = 'api/comissions';

export function fetchAll(): Promise<Commission[]> {
  return get(`${domainUrl}`).then(json =>
    Promise.resolve(
      json
        ? json.map(
            (data, index) =>
              new Commission(
                data.id,
                data.name,
                new Subject(
                  data.subject.id,
                  data.subject.code,
                  data.subject.name,
                ),
                new Date(),
              ),
          )
        : [],
    ),
  );
}

export default {fetchAll};
