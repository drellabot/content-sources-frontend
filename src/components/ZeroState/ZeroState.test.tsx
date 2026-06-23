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

  it('shows both cards with correct content', () => {
    const setZeroState = jest.fn();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: false,
    });

    render(<ZeroState />);

    expect(screen.getByText(/Get started with Insights/i)).toBeInTheDocument();
    expect(screen.getByText('About content templates')).toBeInTheDocument();
    expect(screen.getByText('About repositories')).toBeInTheDocument();
    expect(screen.getByText(/Content templates use repository snapshots/i)).toBeInTheDocument();
    expect(screen.getByText(/Repositories provide the content sources/i)).toBeInTheDocument();
  });

  it('navigates to browse repositories from the repositories card', async () => {
    const setZeroState = jest.fn();
    const user = userEvent.setup();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: false,
    });

    render(<ZeroState />);

    await user.click(screen.getByRole('button', { name: 'Browse available repositories' }));
    expect(setZeroState).toHaveBeenCalledWith(false);
    expect(navigateMock).toHaveBeenCalledWith('/insights/content/repositories?origin=red_hat');
  });

  it('navigates to create template from CTA button', async () => {
    const setZeroState = jest.fn();
    const user = userEvent.setup();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: false,
    });

    render(<ZeroState />);

    await user.click(screen.getByRole('button', { name: 'Create template' }));
    expect(setZeroState).toHaveBeenCalledWith(false);
    expect(navigateMock).toHaveBeenCalledWith('/insights/content/templates/add');
  });

  it('navigates to add repositories from CTA button', async () => {
    const setZeroState = jest.fn();
    const user = userEvent.setup();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: false,
    });

    render(<ZeroState />);

    await user.click(screen.getByRole('button', { name: 'Add repositories' }));
    expect(setZeroState).toHaveBeenCalledWith(false);
    expect(navigateMock).toHaveBeenCalledWith('/insights/content/repositories');
  });

  it('renders learn more links', () => {
    const setZeroState = jest.fn();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: false,
    });

    render(<ZeroState />);

    const learnMoreLinks = screen.getAllByRole('link');
    expect(learnMoreLinks).toHaveLength(2);
    expect(
      screen.getByText('Learn more about managing system content and patch updates'),
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more about repositories')).toBeInTheDocument();
  });

  it('uses lightspeed copy when enabled', () => {
    const setZeroState = jest.fn();
    (useAppContext as jest.Mock).mockReturnValue({
      setZeroState,
      isLightspeedEnabled: true,
    });

    render(<ZeroState />);

    expect(screen.getByText(/Get started with Red Hat Lightspeed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create template' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add repositories' })).toBeInTheDocument();
  });
});
