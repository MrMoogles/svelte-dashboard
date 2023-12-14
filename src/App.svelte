<script>
  import { onMount } from "svelte";
  import "./AppStyles.css";
  let menuOpen = false;
  let menuItems = [];
  let subMenuItems = [];
  let activeMenuItemId = null;

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  async function fetchMenuItems(projectId = null) {
    try {
      const url =
        projectId === null
          ? "http://localhost:5000/api/projects"
          : `http://localhost:5000/api/environments/${projectId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      projectId === null
        ? (menuItems = await response.json())
        : (subMenuItems = await response.json());
    } catch (error) {
      console.error("Fetching menu items failed:", error);
    }
  }

  function handleMenuItemClick(itemId) {
    if (activeMenuItemId === itemId) {
      activeMenuItemId = null;
      subMenuItems = [];
    } else {
      subMenuItems = [];
      activeMenuItemId = itemId;
      fetchMenuItems(itemId);
    }
  }

  onMount(async () => {
    fetchMenuItems();
  });
</script>

<div class="dashboard d-flex">
  <!-- Bootstrap Hamburger Button -->
  <nav class="navbar">
    <button class="navbar-toggler" type="button" on:click={toggleMenu}>
      <span class="navbar-toggler-icon"></span>
    </button>
  </nav>

  <div class="menu" class:open={menuOpen}>
    <ul>
      {#each menuItems as item}
        <li>
          <button
            class="menu-button"
            on:click={() => handleMenuItemClick(item.id)}
          >
            {item.project_name}
          </button>
          {#if activeMenuItemId === item.id && subMenuItems.length > 0}
            <ul class="submenu">
              {#each subMenuItems as subItem}
                <li>
                  <button>{subItem.environment}</button>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </div>

  <div class="content" class:full={!menuOpen}>
    <!-- Dashboard Content Here -->
  </div>
</div>
