import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';

const Header = () => {
	return (
		<header className='h-14 border-b bg-gray-50'>
			<div className='container flex h-full items-center justify-between'>
				<p className='font-semibold'>DRIVE (CE)</p>

				<div className='flex items-center gap-7'>
					<div className='h-8'>
						<OrganizationSwitcher />
					</div>

					<UserButton />
				</div>
			</div>
		</header>
	);
};

export default Header;
