import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdatePortalLeadNotificationsDto } from 'src/infrastructure/ofs/dtos/update-portal-lead-notifications.dto';

describe('UpdatePortalLeadNotificationsDto', () => {
  it('validates every nested notification', async () => {
    const dto = plainToInstance(UpdatePortalLeadNotificationsDto, {
      notifications: [
        {
          ofsId: '550e8400-e29b-41d4-a716-446655440000',
          frequency: 'daily',
        },
        { ofsId: 123, frequency: 'sometimes' },
      ],
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('notifications');
    expect(errors[0].children?.[0].children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ property: 'ofsId' }),
        expect.objectContaining({ property: 'frequency' }),
      ]),
    );
  });
});
