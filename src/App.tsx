import { lazy, Suspense, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Detail from './pages/Detail/Detail';
import Edit from './pages/Edit/Edit';
import { MainLayout } from './layouts/MainLayout';
import { Item } from './types/item';
import { createItem, getItems, updateItem } from './utils/api';
import { createItemId } from './utils/storage';
import './styles/_global.scss';

const Career = lazy(() => import('./pages/Career/Career'));
const GuideIndex = lazy(() => import('./pages/Guide/GuideIndex'));
const GuidePage = lazy(() => import('./pages/Guide/GuidePage'));
const AwardsIndex = lazy(() => import('./pages/Awards/AwardsIndex'));
const AwardCategory = lazy(() => import('./pages/Awards/AwardCategory'));
const AwardDetail = lazy(() => import('./pages/Awards/AwardDetail'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

const PageFallback = () => (
  <div style={{ textAlign: 'center', padding: '64px 16px', color: '#b8c7ef' }}>
    読込中...
  </div>
);

function App() {
  const [items, setItems] = useState<Item[]>([]);

  const normalizeItem = (raw: any): Item => {
    const image = raw.image || raw.imageUrl || raw.images?.[0]?.url || '';
    const images = Array.isArray(raw.images)
      ? raw.images.map((img: any) => ({ url: String(img.url || ''), comment: String(img.comment || '') }))
      : image
        ? [{ url: image, comment: '' }]
        : [];

    return {
      id: String(raw.id || createItemId()),
      name: String(raw.name || raw.nameEn || ''),
      nameJP: String(raw.nameJP || raw.nameJa || ''),
      category: String(raw.category || ''),
      image,
      description: String(raw.description || ''),
      images,
      vehicleData: raw.vehicleData || undefined,
      acquisition: raw.acquisition || undefined,
      rare: raw.rare || undefined,
      spawnConditions: raw.spawnConditions || undefined,
    };
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const remote = await getItems();
        if (!mounted) return;
        setItems(remote.map(normalizeItem));
      } catch (e) {
        if (!mounted) return;
        console.error('failed to fetch items from API', e);
        setItems([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);



  const upsertItemState = (target: Item) => {
    setItems((current) => {
      const exists = current.some((item) => item.id === target.id);
      if (!exists) return [target, ...current];
      return current.map((item) => (item.id === target.id ? target : item));
    });
  };

  const handleDeleteFromState = (id: string) => {
    setItems((current) => current.filter((it) => it.id !== id));
  };

  const handleSave = async (item: Item) => {
    upsertItemState(item);
    try {
      const exists = items.some((it) => it.id === item.id);
      if (exists) {
        await updateItem(item as any);
      } else {
        await createItem(item as any);
      }
    } catch {
      // fallback: local-only persistence already applied
    }
  };

  const handleCreateNew = (): Item => ({
    id: createItemId(),
    name: '',
    nameJP: '',
    category: 'スーパーカー',
    image: '',
    description: '',
    images: [],
  });

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home items={items} onSave={handleSave} />} />
        <Route path="/cars" element={<Home items={items} onSave={handleSave} />} />
        <Route path="/detail/:id" element={<Detail items={items} onSave={handleSave} />} />
        <Route path="/edit/new" element={<Edit mode="create" item={handleCreateNew()} items={items} onSave={handleSave} onDelete={handleDeleteFromState} />} />
        <Route path="/edit/:id" element={<Edit mode="edit" items={items} onSave={handleSave} onDelete={handleDeleteFromState} />} />
        <Route
          path="/career"
          element={
            <Suspense fallback={<PageFallback />}>
              <Career />
            </Suspense>
          }
        />
        <Route
          path="/guide"
          element={
            <Suspense fallback={<PageFallback />}>
              <GuideIndex />
            </Suspense>
          }
        />
        <Route
          path="/guide/:slug"
          element={
            <Suspense fallback={<PageFallback />}>
              <GuidePage />
            </Suspense>
          }
        />
        <Route
          path="/awards"
          element={
            <Suspense fallback={<PageFallback />}>
              <AwardsIndex />
            </Suspense>
          }
        />
        <Route
          path="/awards/:category"
          element={
            <Suspense fallback={<PageFallback />}>
              <AwardCategory />
            </Suspense>
          }
        />
        <Route
          path="/awards/:category/:id"
          element={
            <Suspense fallback={<PageFallback />}>
              <AwardDetail />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageFallback />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
    </MainLayout>
  );
}

export default App;
