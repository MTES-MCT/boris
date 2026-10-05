import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import manager from '$lib/managers/eligibility-simulator.svelte';

vi.mock('$app/environment', () => ({ browser: false }));

describe('saving an eligibility simulation', () => {
  beforeEach(() => {
    manager.currentStep = manager.steps[2];
    manager.currentPhase = manager.steps[2].phases[0];
    manager.saveError = null;
    manager.loading = false;
    manager.eligibilitySimulation = { id: 'simulation-id' } as NonNullable<
      typeof manager.eligibilitySimulation
    >;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('keeps the current phase and existing simulation when the API rejects locations', async () => {
    const phase = manager.currentPhase;
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              message: ['locations.0.property id should not exist'],
            }),
            { status: 400 },
          ),
        ),
    );
    const next = vi.spyOn(manager, 'goToNextPhase');

    await manager.updateEligibilitySimulation({ locations: [] });

    expect(next).not.toHaveBeenCalled();
    expect(manager.currentPhase).toBe(phase);
    expect(manager.eligibilitySimulation?.id).toBe('simulation-id');
    expect(manager.saveError).toBeTruthy();
    expect(manager.loading).toBe(false);
  });

  it('allows retry after a network failure', async () => {
    const next = vi.spyOn(manager, 'goToNextPhase');
    const saved = { id: 'simulation-id', locations: [{ id: 'location-id' }] };
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(new Response(JSON.stringify(saved))),
    );

    await manager.updateEligibilitySimulation({ locations: [] });
    expect(next).not.toHaveBeenCalled();
    expect(manager.saveError).toBeTruthy();
    expect(manager.loading).toBe(false);

    await manager.updateEligibilitySimulation({ locations: [] });
    expect(next).toHaveBeenCalledTimes(1);
    expect(manager.eligibilitySimulation).toEqual(saved);
    expect(manager.saveError).toBeNull();
    expect(manager.loading).toBe(false);
  });
});
