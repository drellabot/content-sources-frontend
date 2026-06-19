import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ZeroState } from './ZeroState';
import { useAppContext } from 'middleware/AppContext';
import { useHref, useNavigate } from 'react-router-dom';
import { ReactNode } from 'react';

jest.mock('middleware/AppContext', () => ({
  useAppContext: jest.fn(),
}));

const navigateMock = jest.fn();

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useHref: jest.fn(),
}));

jest.mock('@redhat-cloud-services/frontend-components/AsyncComponent', () => {
  function MockAsyncComponent({
    customText,
    customSection,
    customButton,
  }: {
    customText: ReactNode;
    customSection: ReactNode;
    customButton: ReactNode;
  }) {
    return (
      <div>
        <div>{customText}</div>
        <div>{customSection}</div>
        <div>{customButton}</div>
      </div>
    );
  }
  return MockAsyncComponent;
});

describe('ZeroState', () => {
  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    (useHref as jest.Mock).mockReturnValue('/insights/content/repositories');
    navigateMock.mockReset();
  });

  it('shows all cards and navigates from buttons', async () => {
    const setZeroState = jest.fn();
    const user = userEvent.setup();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: false,
    });

    render(<ZeroState />);

    expect(screen.getByText(/Get started with Insights/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse Red Hat repositories' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add custom repositories' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create a template' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Browse Red Hat repositories' }));
    expect(setZeroState).toHaveBeenCalledWith(false);
    expect(navigateMock).toHaveBeenCalledWith('/insights/content/repositories?origin=red_hat');
  });

  it('navigates to custom repositories', async () => {
    const setZeroState = jest.fn();
    const user = userEvent.setup();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: false,
    });

    render(<ZeroState />);

    await user.click(screen.getByRole('button', { name: 'Add custom repositories' }));
    expect(setZeroState).toHaveBeenCalledWith(false);
    expect(navigateMock).toHaveBeenCalledWith('/insights/content/repositories');
  });

  it('navigates to templates', async () => {
    const setZeroState = jest.fn();
    const user = userEvent.setup();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: false,
    });

    render(<ZeroState />);

    await user.click(screen.getByRole('button', { name: 'Create a template' }));
    expect(setZeroState).toHaveBeenCalledWith(false);
    expect(navigateMock).toHaveBeenCalledWith('/insights/content/templates');
  });

  it('dismisses zero state when clicking get started button', async () => {
    const setZeroState = jest.fn();
    const user = userEvent.setup();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: false,
    });

    render(<ZeroState />);

    await user.click(screen.getByRole('button', { name: 'Get started' }));
    expect(setZeroState).toHaveBeenCalledWith(false);
  });

  it('uses lightspeed copy when enabled', () => {
    const setZeroState = jest.fn();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: true,
    });

    render(<ZeroState />);

    expect(screen.getByText(/Get started with Red Hat Lightspeed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Browse Red Hat repositories' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create a template' })).toBeInTheDocument();
  });
});
