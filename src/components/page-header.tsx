"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PixelIcon } from "@/components/pixel-art/PixelIcon"
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { Fragment } from "react"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  breadcrumbs: BreadcrumbItem[]
  className?: string
}

export function PageHeader({ breadcrumbs, className }: PageHeaderProps) {
  return (
    <header className={`flex h-16 shrink-0 items-center gap-2 border-b px-4 max-w-full overflow-x-hidden ${className ?? ""}`}>
      <SidebarTrigger className="-ml-1 hidden md:flex" />
      <Link href="/admin" className="flex items-center gap-2 md:hidden">
        <div className="flex items-center justify-center size-8 bg-pixel-pink pixel-border pixel-shadow">
          <PixelIcon icon="link" size="xs" />
        </div>
        <span className="text-lg font-black pixel-text-shadow">link-it</span>
      </Link>
      <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
      <Breadcrumb className="min-w-0 flex-1">
        <BreadcrumbList className="flex-wrap">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <Fragment key={item.label}>
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="truncate">{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={item.href} className="truncate">
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <UserButton
        appearance={{
          variables: {
            colorText: '#f5f5f5',
            colorTextSecondary: '#a0a0a0',
            colorBackground: '#1a1a2e',
            colorInputBackground: '#0d0d1a',
            colorInputText: '#f5f5f5',
            colorPrimary: '#A855F7',
            colorDanger: '#F38181',
            colorSuccess: '#95E1D3',
          },
          elements: {
            avatarBox: "size-9",
            userButtonTrigger: {
              borderRadius: '50%',
              border: 'none',
              boxShadow: 'none',
              transition: 'all 0.15s ease',
              '&:hover': {
                opacity: '0.8',
              },
            },
            userButtonPopoverCard: {
              backgroundColor: '#1a1a2e',
              border: '3px solid #2D3436',
              boxShadow: '4px 4px 0 0 #2D3436',
              borderRadius: '0px',
            },
            userButtonPopoverMain: {
              padding: '12px',
            },
            userButtonPopoverActions: {
              padding: '8px',
              gap: '4px',
            },
            userButtonPopoverActionButton: {
              borderRadius: '0px',
              padding: '10px 12px',
              transition: 'all 0.15s ease',
              color: '#f5f5f5',
              border: '2px solid transparent',
              '&:hover': {
                border: '2px solid #ffffff',
                backgroundColor: 'transparent',
                color: '#f5f5f5',
              },
            },
            userButtonPopoverActionButtonText: {
              color: '#f5f5f5',
              fontWeight: '600',
            },
            userButtonPopoverActionButtonIcon: {
              color: '#A855F7',
            },
            userPreviewMainIdentifier: {
              color: '#f5f5f5',
              fontWeight: '700',
              fontSize: '15px',
            },
            userPreviewSecondaryIdentifier: {
              color: '#a0a0a0',
              fontSize: '13px',
            },
            userPreviewAvatarBox: {
              border: '2px solid #2D3436',
              borderRadius: '0px',
            },
            userButtonPopoverFooter: "hidden",
            // User Profile (Manage Account) styling
            rootBox: {
              color: '#f5f5f5',
            },
            modalContent: {
              backgroundColor: '#1a1a2e',
              border: '3px solid #2D3436',
              boxShadow: '4px 4px 0 0 #2D3436',
              borderRadius: '0px',
              color: '#f5f5f5',
            },
            modalContent__userProfile: {
              color: '#f5f5f5',
            },
            modalBackdrop: {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
            card: {
              backgroundColor: '#1a1a2e',
              border: '3px solid #2D3436',
              boxShadow: '4px 4px 0 0 #2D3436',
              borderRadius: '0px',
            },
            navbar: {
              backgroundColor: '#1a1a2e',
              borderRight: '2px solid #2D3436',
            },
            navbarButton: {
              color: '#f5f5f5',
              borderRadius: '0px',
              border: '2px solid transparent',
              '&:hover': {
                border: '2px solid #ffffff',
                backgroundColor: 'transparent',
              },
            },
            navbarButtonIcon: {
              color: '#A855F7',
            },
            pageScrollBox: {
              backgroundColor: '#1a1a2e',
            },
            page: {
              backgroundColor: '#1a1a2e',
            },
            profileSection: {
              borderBottom: '1px solid #2D3436',
            },
            profileSectionTitle: {
              color: '#f5f5f5',
              fontWeight: '700',
            },
            profileSectionTitleText: {
              color: '#f5f5f5',
            },
            profileSectionContent: {
              color: '#a0a0a0',
            },
            profileSectionPrimaryButton: {
              backgroundColor: '#FF6B9D',
              color: '#ffffff',
              borderRadius: '0px',
              border: '2px solid #2D3436',
              boxShadow: '3px 3px 0 0 #2D3436',
              '&:hover': {
                transform: 'translate(-2px, -2px)',
                boxShadow: '5px 5px 0 0 #2D3436',
              },
            },
            formButtonPrimary: {
              backgroundColor: '#FF6B9D',
              color: '#ffffff',
              borderRadius: '0px',
              border: '2px solid #2D3436',
              boxShadow: '3px 3px 0 0 #2D3436',
              '&:hover': {
                transform: 'translate(-2px, -2px)',
                boxShadow: '5px 5px 0 0 #2D3436',
              },
            },
            formFieldLabel: {
              color: '#f5f5f5',
            },
            formFieldInput: {
              backgroundColor: '#0d0d1a',
              color: '#f5f5f5',
              border: '2px solid #2D3436',
              borderRadius: '0px',
            },
            formFieldSuccessText: {
              color: '#95E1D3',
            },
            formFieldErrorText: {
              color: '#F38181',
            },
            headerTitle: {
              color: '#f5f5f5',
            },
            headerSubtitle: {
              color: '#a0a0a0',
            },
            // Additional text elements
            formFieldLabelRow: {
              color: '#f5f5f5',
            },
            formFieldHintText: {
              color: '#a0a0a0',
            },
            tableHead: {
              color: '#f5f5f5',
            },
            // Profile details text
            profileSectionItemList: {
              color: '#f5f5f5',
            },
            userProfileSectionItemList: {
              color: '#f5f5f5',
            },
            textPrimary: {
              color: '#f5f5f5',
            },
            textSecondary: {
              color: '#a0a0a0',
            },
            text: {
              color: '#f5f5f5',
            },
            // Device/session info
            deviceInfo: {
              color: '#f5f5f5',
            },
            deviceInfoRow: {
              color: '#a0a0a0',
            },
            activeDevice: {
              color: '#f5f5f5',
            },
            activeDeviceListItem: {
              color: '#f5f5f5',
            },
            // Connected accounts
            socialButtonsProviderIcon__google: {
              filter: 'brightness(1.2)',
            },
            providerIcon: {
              filter: 'brightness(1.2)',
            },
            identityPreview: {
              color: '#f5f5f5',
            },
            identityPreviewText: {
              color: '#f5f5f5',
            },
            identityPreviewEditButtonIcon: {
              color: '#A855F7',
            },
            accordionTriggerButton: {
              color: '#f5f5f5',
              border: '2px solid transparent',
              '&:hover': {
                border: '2px solid #ffffff',
              },
            },
            accordionContent: {
              backgroundColor: '#0d0d1a',
            },
            badge: {
              backgroundColor: '#A855F7',
              color: '#ffffff',
              borderRadius: '0px',
            },
            menuButton: {
              color: '#f5f5f5',
              border: '2px solid transparent',
              '&:hover': {
                border: '2px solid #ffffff',
                backgroundColor: 'transparent',
              },
            },
            menuList: {
              backgroundColor: '#1a1a2e',
              border: '2px solid #2D3436',
              borderRadius: '0px',
            },
            menuItem: {
              color: '#f5f5f5',
              '&:hover': {
                backgroundColor: 'transparent',
                border: '2px solid #ffffff',
              },
            },
            footer: {
              display: 'none',
            },
          },
        }}
      />
    </header>
  )
}
