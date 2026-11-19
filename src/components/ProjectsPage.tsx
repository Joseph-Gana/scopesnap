import { FileText, FolderOpen, Trash2 } from 'lucide-react';
import { Button, Card, CardHeader, SectionTitle, Tag } from '@/components/ui/Primitives';
import { EmptyState } from '@/components/ui/Feedback';
import { formatMoneyFromCents } from '@/lib/currency';
import type { Project } from '@/lib/types';
import type { View } from '@/hooks/useAppController';

export function ProjectsPage({
  projects,
  activeProjectId,
  onOpen,
  onDelete,
  go,
}: {
  projects: Project[];
  activeProjectId: string | null;
  onOpen: (project: Project) => void;
  onDelete: (id: string) => void;
  go: (view: View) => void;
}) {
  const sorted = [...projects].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return (
    <div className="space-y-6">
      <SectionTitle
        title="My Projects"
        description="Saved on this device. Open a project to continue editing its scope, quote, or proposal."
      />
      {sorted.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-6 w-6" />}
          title="No saved projects yet"
          description="Analyze a client brief and your project will appear here automatically."
          action={<Button onClick={() => go('brief')}>Analyze a brief</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {sorted.map((project) => (
            <Card key={project.id} className={`transition hover:shadow-lift ${project.id === activeProjectId ? 'ring-2 ring-accent-300' : ''}`}>
              <CardHeader
                icon={<FileText className="h-5 w-5" />}
                title={project.name}
                subtitle={`Updated ${new Date(project.updatedAt).toLocaleDateString()}`}
                actions={<Tag tone="info">{project.quote.currency}</Tag>}
              />
              <div className="px-5 py-4">
                <p className="text-sm text-navy-500">
                  {project.scope.deliverables.filter((d) => d.title.trim()).length} deliverables ·{' '}
                  {project.quote.totalCents > 0 ? formatMoneyFromCents(project.quote.totalCents, project.quote.currency) : 'not priced'}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm" onClick={() => onOpen(project)}>Open project</Button>
                  <Button size="sm" variant="ghost" onClick={() => go('quote')}>Quote</Button>
                  <Button size="sm" variant="ghost" onClick={() => go('proposal')}>Proposal</Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(project.id)} aria-label="Delete project">
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
