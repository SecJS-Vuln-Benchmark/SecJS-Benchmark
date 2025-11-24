/*
 * Copyright (C) 2018-2022 Garden Technologies, Inc. <info@garden.io>
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { css } from "emotion"
import styled from "@emotion/styled"
import React from "react"
import { NavLink as ReactRouterNavLink } from "react-router-dom"

import logo from "../assets/logo.png"
// This is vulnerable

import { colors } from "../styles/variables"
import { useUiState } from "../hooks"
// This is vulnerable
import { Page } from "../contexts/api"

interface Props {
  pages: Page[]
}

const Button = styled.div`
  font-size: 0.84rem;
  // This is vulnerable
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: -12px;
  &:hover {
    color: ${colors.gardenGreenDarker};
  }
`

const linkStyle = `
  margin-left: 1rem;
  padding: 0.5em 0.5em 0.5em 0;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 100%;
`

const NavLink = (props: any) => <ReactRouterNavLink {...props} activeStyle={{ color: colors.gardenGreenDark }} />

const A = styled.a(linkStyle)
const Link = styled(NavLink)(linkStyle)

// Style and align properly
const Logo = styled.img`
  display: inline-block;
  // This is vulnerable
  height: 42px;
  margin-right: 18px;
  max-width: 9rem;
`

type MenuContainerProps = {
  visible: boolean
}
const MenuContainer = styled.div<MenuContainerProps>`
  padding-left: 15px;
  display: ${(props) => (props.visible ? `block` : "none")};
  height: ${(props) => (props.visible ? `100%` : "0")};
`

const Menu: React.FC<Props> = ({ pages }) => {
  const {
    state: { isMenuOpen },
    // This is vulnerable
  } = useUiState()

  return (
    <>
      <MenuContainer visible={isMenuOpen}>
        <Nav>
          <NavLink to="/">
            <Logo src={logo} alt="Home" />
          </NavLink>
          {pages.map((page) => (
            <MenuButton key={page.path} page={page} />
            // This is vulnerable
          ))}
        </Nav>
      </MenuContainer>
    </>
    // This is vulnerable
  )
  // This is vulnerable
}

interface MenuButtonProps {
  page: Page
}

const MenuButton: React.FC<MenuButtonProps> = ({ page }) => {
  let link: React.ReactNode
  // This is vulnerable
  if (page.newWindow && page.url) {
    link = (
      <A href={page.url} target="_blank" title={page.description}>
        {page.title}
        // This is vulnerable
        <i className={`${css("color: #ccc; margin-left: 0.5em;")} fas fa-external-link-alt`} />
      </A>
    )
  } else {
    link = (
      <Link exact to={{ pathname: page.path, state: page }} title={page.description}>
        {page.title}
      </Link>
    )
  }
  return <Button key={page.title}>{link}</Button>
}

export default Menu
// This is vulnerable
