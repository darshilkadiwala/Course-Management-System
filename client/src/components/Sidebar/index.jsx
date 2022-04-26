import React from 'react';

export default function Sidebar() {
	return (
		<>
			<div id='l-nav-body'>
				<div class='l-navbar ' id='l-navbar'>
					<nav class='l-nav'>
						<div class='l-nav-toggle nav-toggle' id='l-nav-toggle'>
							<i class='bx bx-menu'></i>
						</div>
						<ul class='l-nav-list'>
							<a href='/FSMS/dashboard' class='l-nav-link'>
								<i class='bx bx-home nav-icon'></i>
								<span class='nav-text'>Home</span>
							</a>
							{/* <?php if (isset($_SESSION['RoleID']) && $_SESSION['RoleID'] != 1) { ?> */}
							<a href='/FSMS/dashboard/profile.php' class='l-nav-link'>
								<i class='bx bxs-user nav-icon'></i>
								<span class='nav-text'>Profile</span>
							</a>
							<a href='/FSMS/chat/' class='l-nav-link'>
								<i class='bx bxs-message-rounded nav-icon'></i>
								<span class='nav-text'>Chat</span>
							</a>
							<a href='/FSMS/order/' class='l-nav-link'>
								<i class='bx bxs-box nav-icon'></i>
								<span class='nav-text'>Order</span>
							</a>
							{/* <?php } ?>
                <?php if (isset($_SESSION['RoleID']) && $_SESSION['RoleID'] == 2) { ?> */}
							<a href='/FSMS/dashboard/services/' class='l-nav-link'>
								<i class='bx bx-list-ul nav-icon'></i>
								<span class='nav-text'>Service</span>
							</a>
							<a href='/FSMS/dashboard/add-discount.php' class='l-nav-link'>
								<i class='bx bx-list-ul nav-icon'></i>
								<span class='nav-text'>Add Discount</span>
							</a>
							{/* <?php } ?>
                <?php if (isset($_SESSION['RoleID']) && $_SESSION['RoleID'] == 1) { ?> */}
							<a href='/FSMS/dashboard/category/' class='l-nav-link'>
								<i class='bx bx-list-ul nav-icon'></i>
								<span class='nav-text'>Category</span>
							</a>
							<a href='/FSMS/dashboard/users/' class='l-nav-link'>
								<i class='bx bxs-group nav-icon'></i>
								<span class='nav-text'>Users</span>
							</a>
							<a href='/FSMS/dashboard/users/users.php' class='l-nav-link'>
								<i class='bx bxs-group nav-icon'></i>
								<span class='nav-text'>All Users</span>
							</a>
							<a href='/FSMS/dashboard/users/pending-request.php' class='l-nav-link'>
								<i class='bx bxs-group nav-icon'></i>
								<span class='nav-text'> Pending Request</span>
							</a>
							<a href='/FSMS/dashboard/users/active-customer.php' class='l-nav-link'>
								<i class='bx bxs-group nav-icon'></i>
								<span class='nav-text'> Active Customer</span>
							</a>
							<a
								href='/FSMS/dashboard/users/active-freelancer.php'
								class='l-nav-link'>
								<i class='bx bxs-group nav-icon'></i>
								<span class='nav-text'> Active FreeLancer</span>
							</a>
							<a href='/FSMS/dashboard/view-contact.php' class='l-nav-link'>
								<i class='bx bx-info-circle nav-icon'></i>
								<span class='nav-text'> Contact Inquiry</span>
							</a>
							{/* <?php } ?> */}

							<a href='/FSMS/dashboard/ChangePassword.php' class='l-nav-link'>
								<i class='bx bxs-key nav-icon'></i>
								<span class='nav-text'>Change Password</span>
							</a>
						</ul>
						<ul class='l-nav-list'>
							<a href='/FSMS/Logout.php' class='l-nav-link nav-btn'>
								<i class='bx bx-log-out-circle nav-icon'></i>
								<span class='nav-text'>Logout</span>
							</a>
						</ul>
					</nav>
				</div>
			</div>
		</>
	);
}
