import { getCollection, type CollectionEntry } from 'astro:content';

/** All projects in display order. */
export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}
