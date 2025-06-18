import 'reflect-metadata';
import AppDataSource  from '../../datasource';
import { RoleEntity } from '../entities/role.entity';

async function seedRoles() {
  try {
    await AppDataSource.initialize();

    const roleRepo = AppDataSource.getRepository(RoleEntity);
    const roles = ['admin', 'gateman', 'occupant'];

    for (const roleName of roles) {
      const exists = await roleRepo.findOne({ where: { name: roleName } });
      if (!exists) {
        const role = roleRepo.create({ name: roleName });
        await roleRepo.save(role);
        console.log(`✅ Inserted role: ${roleName}`);
      } else {
        console.log(`ℹ️ Role already exists: ${roleName}`);
      }
    }

    await AppDataSource.destroy();
    console.log('🌱 Role seeding complete.');
  } catch (err) {
    console.error('❌ Error seeding roles:', err);
    await AppDataSource.destroy();
  }
}

seedRoles();
