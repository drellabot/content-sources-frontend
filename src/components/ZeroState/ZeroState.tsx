import { Suspense } from 'react';
import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  Flex,
  FlexItem,
  Grid,
  PageSection,
  Spinner,
  Content,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon } from '@patternfly/react-icons';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import ErrorState from '@redhat-cloud-services/frontend-components/ErrorState';
import { createUseStyles } from 'react-jss';

import { useAppContext } from 'middleware/AppContext';
import { useHref, useNavigate } from 'react-router-dom';
import { ADD_ROUTE, REPOSITORIES_ROUTE, TEMPLATES_ROUTE } from 'Routes/constants';

const CONTENT_DOCS_URL =
  'https://docs.redhat.com/en/documentation/red_hat_lightspeed/1-latest/html/managing_system_content_and_patch_updates_on_rhel_systems/index';

const useStyles = createUseStyles({
  contentZerostate: {
    minHeight: '100%',
    '& .bannerBefore': { maxHeight: '320px!important' },
    '& .bannerRight': { justifyContent: 'space-evenly!important' },
  },
  textContent: {
    minHeight: '40px',
  },
  removeBottomPadding: {
    paddingBottom: '0',
  },
});

export const ZeroState = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setZeroState, isLightspeedEnabled } = useAppContext();
  const path = useHref('content');
  const pathname = path.split('content')[0] + 'content';

  return (
    <>
      <Suspense
        fallback={
          <Bullseye>
            <Spinner size='xl' />
          </Bullseye>
        }
      >
        <Grid className={classes.contentZerostate}>
          <AsyncComponent
            appId='content_zero_state'
            appName='dashboard'
            module='./AppZeroState'
            scope='dashboard'
            ErrorComponent={<ErrorState />}
            app='Content_management'
            ouiaId='get_started_from_zerostate_description'
            customText={`Get started with ${isLightspeedEnabled ? 'Red Hat Lightspeed' : 'Insights'} content lifecycle management`}
            customSection={
              <PageSection hasBodyWrapper={false} className={classes.removeBottomPadding}>
                <Flex direction={{ default: 'row' }} gap={{ default: 'gap' }}>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Card isFullHeight>
                      <CardTitle>
                        <Title headingLevel='h3'>About content templates</Title>
                      </CardTitle>
                      <CardBody>
                        <Content className={classes.textContent}>
                          <Content component='p'>
                            Content templates use repository snapshots to control which advisories
                            and package versions are applied when patching your RHEL systems.
                          </Content>
                        </Content>
                        <Button
                          variant='link'
                          isInline
                          component='a'
                          href={CONTENT_DOCS_URL}
                          target='_blank'
                          rel='noopener noreferrer'
                          icon={<ExternalLinkSquareAltIcon />}
                          iconPosition='end'
                        >
                          Learn more about managing system content and patch updates
                        </Button>
                      </CardBody>
                    </Card>
                  </FlexItem>
                  <FlexItem flex={{ default: 'flex_1' }}>
                    <Card isFullHeight>
                      <CardTitle>
                        <Title headingLevel='h3'>About repositories</Title>
                      </CardTitle>
                      <CardBody>
                        <Content className={classes.textContent}>
                          <Content component='p'>
                            Repositories provide the content sources that templates use to define
                            what packages and advisories are available to your systems.
                          </Content>
                          <Content component='p'>
                            You can use official Red Hat content, add external sources, or upload
                            custom RPMs.
                          </Content>
                        </Content>
                        <Button
                          onClick={() => {
                            setZeroState(false);
                            navigate(`${pathname}/${REPOSITORIES_ROUTE}?origin=red_hat`);
                          }}
                          variant='secondary'
                          size='lg'
                        >
                          Browse available repositories
                        </Button>
                        <br />
                        <Button
                          variant='link'
                          isInline
                          component='a'
                          href={CONTENT_DOCS_URL}
                          target='_blank'
                          rel='noopener noreferrer'
                          icon={<ExternalLinkSquareAltIcon />}
                          iconPosition='end'
                        >
                          Learn more about repositories
                        </Button>
                      </CardBody>
                    </Card>
                  </FlexItem>
                </Flex>
              </PageSection>
            }
            customButton={
              <>
                <Button
                  id='create-template-button'
                  ouiaId='create_template_button'
                  onClick={() => {
                    setZeroState(false);
                    navigate(`${pathname}/${TEMPLATES_ROUTE}/${ADD_ROUTE}`);
                  }}
                >
                  Create template
                </Button>
                <Button
                  id='add-repositories-button'
                  ouiaId='add_repositories_button'
                  variant='secondary'
                  onClick={() => {
                    setZeroState(false);
                    navigate(`${pathname}/${REPOSITORIES_ROUTE}`);
                  }}
                >
                  Add repositories
                </Button>
              </>
            }
          />
        </Grid>
      </Suspense>
    </>
  );
};
