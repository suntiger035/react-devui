import type { DMenuItem } from '@react-devui/ui/components/menu';
import type { DNestedChildren } from '@react-devui/ui/utils/global';

import menu from 'dist/menu.json';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

import { DDrawer, DMenu, useMediaMatch } from '@react-devui/ui';

import './Sidebar.scss';

export function AppSidebar(props: { aMenuOpen: boolean; onMenuOpenChange: (open: boolean) => void }) {
  const { aMenuOpen, onMenuOpenChange } = props;

  const { t, i18n } = useTranslation();

  const location = useLocation();
  const page = location.pathname.startsWith('/components/') ? 'Components' : 'Components';
  const activeId = location.pathname.match(/(?<=^\/components\/).+$/)?.[0] ?? null;

  const menuNode = (
    <DMenu
      className="app-sidebar__menu"
      dList={menu.map<DNestedChildren<DMenuItem<string> & { to?: string }>>((group) => ({
        id: group.title,
        title: t(`menu.components-group.${group.title}`),
        type: 'group',
        children: (group.title === 'Other'
          ? group.children.concat([{ title: 'Interface', to: '/components/Interface' }])
          : group.children
        ).map((child) => ({
          id: child.title,
          title: (
            <Link to={child.to}>
              {child.title}
              {i18n.language !== 'en-US' && <span className="app-sidebar__subtitle">{t(`menu.components.${child.title}`)}</span>}
            </Link>
          ),
          type: 'item',
        })),
      }))}
      dActive={activeId}
      onActiveChange={() => {
        onMenuOpenChange(false);
      }}
    ></DMenu>
  );

  const mediaMatch = useMediaMatch();

  return mediaMatch.includes('md') ? (
    <div className="app-sidebar">{menuNode}</div>
  ) : (
    <DDrawer
      className="app-sidebar__drawer"
      dVisible={aMenuOpen}
      dHeader={
        <DDrawer.Header>
          <img className="app-sidebar__logo" src="/assets/logo.svg" alt="Logo" width="24" height="24" />
          <span className="app-sidebar__title">{page}</span>
        </DDrawer.Header>
      }
      dWidth={280}
      onVisibleChange={onMenuOpenChange}
    >
      {menuNode}
    </DDrawer>
  );
}
