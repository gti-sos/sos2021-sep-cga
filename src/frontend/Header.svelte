<script>
	import {
		Collapse,
		Navbar,
		NavbarToggler,
		NavbarBrand,
		Nav,
		NavItem,
		NavLink
	} from 'sveltestrap';
	
	let isOpen = false;
  const toggleNav = () => (isOpen = !isOpen);
  
</script>
<main>

<Navbar style="background-color:#24355C;" dark
class="fixed-top">
  <NavbarBrand href="/" class="mr-auto"><strong>sos2021-sep-cga</strong></NavbarBrand>
  <NavbarToggler on:click={toggleNav} className="mr-2" />
  <Collapse {isOpen} navbar>
   <!--- <Nav navbar>
      <NavItem>
        <NavLink href="#/olimpic-stats">Documentación</NavLink>
      </NavItem>
    </Nav> -->
  </Collapse>
</Navbar>

</main>