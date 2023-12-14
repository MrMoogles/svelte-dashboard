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
    const url =
      projectId === null
        ? "http://localhost:5000/api/projects"
        : `http://localhost:5000/api/environments/${projectId}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error("Fetching menu items failed:", error);
      return [];
    }
  }

  function handleMenuItemClick(itemId) {
    if (activeMenuItemId === itemId) {
      activeMenuItemId = null;
    } else {
      activeMenuItemId = itemId;
    }
  }

  $: if (activeMenuItemId === null) {
    subMenuItems = [];
  } else {
    subMenuItems = [];
    fetchMenuItems(activeMenuItemId).then((items) => {
      subMenuItems = items;
    });
  }

  onMount(() => {
    fetchMenuItems().then((items) => {
      menuItems = items;
    });
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
    {#each menuItems as item}
      <div>
        <button
          class="menu-button"
          on:click={() => handleMenuItemClick(item.id)}
        >
          {item.project_name}
        </button>
        {#if activeMenuItemId === item.id && subMenuItems !== undefined}
          {#if subMenuItems.length > 0}
            <div class="submenu">
              {#each subMenuItems as subItem}
                <div>
                  <button>{subItem.environment}</button>
                </div>
              {/each}
            </div>
          {:else}
            <div>No submenu items found.</div>
          {/if}
        {/if}
      </div>
    {/each}
  </div>

  <div class="content" class:full={!menuOpen}>
    <!-- Dashboard Content Here -->
  </div>
</div>
