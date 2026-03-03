import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from 'src/infrastructure/mailer/mailer.service';
import type { MailerTo } from 'src/domain/mailer/mailer.service.interface';

global.fetch = jest.fn();

describe('MailerService', () => {
  let mailerService: MailerService;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  const brevoApiKey = 'test-brevo-api-key';

  beforeEach(async () => {
    process.env.BREVO_API_KEY = brevoApiKey;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MailerServiceInterface',
          useClass: MailerService,
        },
      ],
    }).compile();

    mailerService = module.get('MailerServiceInterface');
    mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
    jest.clearAllMocks();

    mockFetch.mockResolvedValue({ ok: true } as Response);
  });

  afterEach(() => {
    delete process.env.BREVO_API_KEY;
  });

  describe('sendEmail', () => {
    it('should call Brevo API with correct URL and method', async () => {
      const to: MailerTo[] = [
        { email: 'user@example.com', name: 'User', params: {} },
      ];

      await mailerService.sendEmail(to, 'Test subject', 1);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/smtp/email',
        expect.objectContaining({
          method: 'POST',
        }),
      );
    });

    it('should send correct headers including api-key', async () => {
      const to: MailerTo[] = [
        { email: 'user@example.com', name: 'User', params: {} },
      ];

      await mailerService.sendEmail(to, 'Subject', 42);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
        }),
      );
    });

    it('should send body with default sender, subject, templateId and single recipient', async () => {
      const to: MailerTo[] = [
        {
          email: 'dest@example.com',
          name: 'Destinataire',
          params: { firstName: 'Jean' },
        },
      ];

      await mailerService.sendEmail(to, 'Mon sujet', 10);

      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);

      expect(body.sender).toEqual({
        email: 'contact@boris.beta.gouv.fr',
        name: 'BoRiS',
      });
      expect(body.subject).toBe('Mon sujet');
      expect(body.templateId).toBe(10);
      expect(body.messageVersions).toHaveLength(1);
      expect(body.messageVersions[0]).toEqual({
        to: [{ email: 'dest@example.com', name: 'Destinataire' }],
        params: { firstName: 'Jean' },
      });
    });

    it('should send body with multiple recipients as messageVersions', async () => {
      const to: MailerTo[] = [
        {
          email: 'a@example.com',
          name: 'User A',
          params: { token: 'abc' },
        },
        {
          email: 'b@example.com',
          name: 'User B',
          params: { token: 'def' },
        },
      ];

      await mailerService.sendEmail(to, 'Bulk email', 5);

      const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);

      expect(body.messageVersions).toHaveLength(2);
      expect(body.messageVersions[0]).toEqual({
        to: [{ email: 'a@example.com', name: 'User A' }],
        params: { token: 'abc' },
      });
      expect(body.messageVersions[1]).toEqual({
        to: [{ email: 'b@example.com', name: 'User B' }],
        params: { token: 'def' },
      });
    });

    it('should not throw when fetch resolves successfully', async () => {
      const to: MailerTo[] = [
        { email: 'user@example.com', name: 'User', params: {} },
      ];

      await expect(
        mailerService.sendEmail(to, 'Subject', 1),
      ).resolves.toBeUndefined();
    });
  });
});
