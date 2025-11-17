import { Injectable } from '@nestjs/common';
import { LandbotApiClientListCustomersInterface } from 'src/domain/landbot-api-client/landbot-api-client-list-customers.interface';
import { LandbotApiClientRepositoryInterface } from 'src/domain/landbot-api-client/landbot-api-client.repository.interface';

@Injectable()
export class LandbotApiClientRepository
  implements LandbotApiClientRepositoryInterface
{
  constructor() {}

  public async listCustomers(
    offset = 0,
    limit = 25,
  ): Promise<LandbotApiClientListCustomersInterface> {
    const reponse = await fetch(
      `${process.env.LANDBOT_API_URL}/customers/?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: `Token ${process.env.LANDBOT_API_TOKEN}`,
        },
      },
    );

    const data = await reponse.json();

    return data;
  }
}
